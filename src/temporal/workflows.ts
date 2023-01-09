import { proxyActivities } from '@temporalio/workflow';
import * as wf from '@temporalio/workflow';
import { Credit } from 'src/interface/credit';
import type * as activities from './activities';
import { Connection } from '@temporalio/client';

export type DSL = {
  root: Statement;
};

type Sequence = {
  elements: Statement[];
};
type ActivityInvocation = {
  name: string;
};
type Parallel = {
  branches: Statement[];
};

type Statement =
  | { activity: ActivityInvocation }
  | { sequence: Sequence }
  | { parallel: Parallel };

export const unblockSignal = wf.defineSignal<[Credit]>('unblock');
export const isBlockedQuery = wf.defineQuery<boolean>('isBlocked');

let isBlocked: boolean

const acts = proxyActivities<typeof activities>({
  startToCloseTimeout: '1 minute',
}) as Record<string, (args: Credit) => Promise<boolean | undefined>>;

export async function DSLInterpreter(dsl: DSL, credit: Credit, connection: Connection): Promise<unknown> {
  return await execute(dsl.root, credit);
}

async function unblockOrCancel(credit: Credit): Promise<Credit> {
  wf.setHandler(unblockSignal, async (newDocs: Credit) => {
    credit.documents.push(...newDocs.documents)
    isBlocked = false
  });

  wf.setHandler(isBlockedQuery, () => isBlocked = true);

  try {
    await wf.condition(() => !isBlocked);
    console.log('Unblocked');
  } catch (err) {
    if (err instanceof wf.CancelledFailure) {
      console.log('Cancelled');
    }
    throw err;
  }

  return credit
}

async function execute(statement: Statement, bindings: Credit): Promise<boolean> {
  bindings = await unblockOrCancel(bindings);
  if ('parallel' in statement) {
    await Promise.all(
      statement.parallel.branches.map((el) => execute(el, bindings)),
    );
  } else if ('sequence' in statement) {
    for (const el of statement.sequence.elements) {
      const result = await execute(el, bindings);
      if (result) {
        break
      }
    }
  } else {
    const activity = statement.activity;
    const activityResult = await acts[activity.name](bindings);
    if (activity.name == "notifyLO") {
      if (activityResult) {
        console.log("Finalizing Workflow")
        return true
      }
    }

    console.log(activityResult);
  }
}
