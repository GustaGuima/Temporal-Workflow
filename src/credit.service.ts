import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreditEntity } from "./interface/CreditEntity";

@Injectable()
export class CreditService {
  constructor(
    @InjectRepository(CreditEntity)
    private creditRepository: Repository<CreditEntity>,
  ) { }

  async create({ credit }: { credit: CreditEntity; }): Promise<CreditEntity> {
    return await this.creditRepository.save(credit);
  }
}
