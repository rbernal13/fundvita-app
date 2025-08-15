import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { FundsModule } from './funds/funds.module';
import { HistoryModule } from './history/history.module';
import { FundSubscriptionsModule } from './fund-subscriptions/fund-subscriptions.module';
import { DynamoDBModule } from './common/dynamodb/dynamodb.module';
import { ConfigModule } from '@nestjs/config';

@Module({
  imports: [ConfigModule.forRoot({
    isGlobal: true,
  }), DynamoDBModule, UsersModule, FundsModule, HistoryModule, FundSubscriptionsModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule { }
