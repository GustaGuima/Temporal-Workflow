import { Injectable, Inject } from '@nestjs/common';
import { Credit } from './interface/credit';
import { CreditEntity } from "./interface/CreditEntity";
import { CreditService } from './credit.service';
import { json } from 'stream/consumers';

@Injectable()
export class AppService {

  @Inject(CreditService)
  private readonly creditService: CreditService;
  
  saveFile(credit: Credit): Credit {
    const creditEntity = new CreditEntity();

    creditEntity.application_id = credit.applicationId;
    creditEntity.pre_approval = credit.preApproval
    creditEntity.mortgage = credit.mortgage.loanAmount

    let creditScore = 0;
    for (const item of credit.applicants) {
      creditScore += item.creditScore;
    }
    creditEntity.credit_score = creditScore
    creditEntity.docs = JSON.stringify(credit.documents)

    try {
      this.creditService.create({ credit: creditEntity })
    } catch (error) {
      console.error('error saving credit: ', error)
    }
   
    return credit;
  }
}
