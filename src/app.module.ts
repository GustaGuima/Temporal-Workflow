import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { TypeOrmModule } from '@nestjs/typeorm/dist/typeorm.module';
import { CreditModule } from './credit.module';
import { CreditEntity } from "./interface/CreditEntity";

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'mysql',
      driver: {},
      host: 'database',
      username: 'root',
      port: 3306,
      password: 'root123',
      database: 'temporal',
      entities: [CreditEntity],
      synchronize: true,
    }), 
    CreditModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
