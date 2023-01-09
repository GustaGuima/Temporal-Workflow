import { Module } from "@nestjs/common";
import { CreditService } from "./credit.service";
import { TypeOrmModule } from '@nestjs/typeorm';
import { CreditEntity } from "./interface/CreditEntity";

@Module({
    imports: [TypeOrmModule.forFeature([CreditEntity])],
    providers: [CreditService],
    exports: [CreditService],
})

export class CreditModule{}