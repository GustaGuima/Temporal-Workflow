import { Controller, Post, Body } from '@nestjs/common';
import { AppService } from './app.service';
import { UploadedFile, UseInterceptors } from '@nestjs/common/decorators';
import { FileInterceptor } from '@nestjs/platform-express';
import { Credit } from './interface/credit';
import { Connection, WorkflowClient } from '@temporalio/client';
import { DSLInterpreter, DSL } from './temporal/workflows';
import { unblockSignal } from './temporal/workflows';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Post('pre-approve')
  @UseInterceptors(FileInterceptor('pre-approve'))
  async handleUpload(@UploadedFile() file) {
    if (!file) throw new Error('file is required');
    let fileCredit = file.buffer.toString();
    fileCredit = JSON.parse(fileCredit) as Credit;

    let dslInput: DSL = {
      root: {
        sequence: {
          elements: [
            { activity: { name: 'verifyFilesActivity' } },
            { activity: { name: 'reviewCreditActivity' } },
            { activity: { name: 'notifyLO' } },
            { activity: { name: 'prepareLO' } },
          ],
        },
      },
    };

    try {
      const connection = await Connection.connect({
        address: "temporal:7233"
      });

      const client = new WorkflowClient({
        connection
      });

      const result = await client.execute(DSLInterpreter, {
        args: [dslInput, fileCredit, connection],
        taskQueue: 'verify-files',
        workflowId: fileCredit.applicationId,
      });
      connection.close()

    } catch (err) {
      console.log('running workflow error: ', err);
    }

    return this.appService.saveFile(fileCredit);
  }

  @Post('add-file')
  async handleAddFile(@Body() body) {
    let docs = body as Credit;

    try {
      const connection = await Connection.connect({
        address: "temporal:7233"
      });

      const client = new WorkflowClient({
        connection
      });

      const handle = client.getHandle(docs.applicationId);
      console.log('blocked?', await handle.signal(unblockSignal, docs));
    } catch (err) {
      console.log('running workflow error: ', err);
    }

    return docs;
  }
}
