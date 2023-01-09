import { Injectable, Inject } from '@nestjs/common';
import { Credit } from './interface/credit';
import { CreditEntity } from "./interface/CreditEntity";
import { CreditService } from './credit.service';

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

    const creditCreate = this.creditService.create({ credit: creditEntity })
    console.log(creditCreate)

    return credit;
  }
}
