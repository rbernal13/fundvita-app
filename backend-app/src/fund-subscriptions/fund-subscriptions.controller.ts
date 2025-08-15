import { Controller, Get, Post, Body, Patch, Param, Delete, Query, Logger } from '@nestjs/common';
import { FundSubscriptionsService } from './fund-subscriptions.service';
import { OpeningDto } from './dto/opening.dto';
import { CancellationDto } from './dto/cancellation.dto';

@Controller('fund-subscriptions')
export class FundSubscriptionsController {

  private readonly logger = new Logger(FundSubscriptionsController.name);

  constructor(private readonly fundSubscriptionsService: FundSubscriptionsService) { }

  @Get('getAll')
  async getFundSubscriptionsByUser(@Query('userId') userId: string) {
    this.logger.log(`Buscando suscripciones de fondos para el usuario: ${userId}`);
    return this.fundSubscriptionsService.getFundSubscriptionsByUser(userId);
  }

  @Post('subscribe')
  async subscribeFund(@Body() openingDto: OpeningDto) {
    this.logger.log(`Suscribiendo al fondo: ${JSON.stringify(openingDto)}`);
    return this.fundSubscriptionsService.subscribeFund(openingDto);
  }

  @Post('cancel')
  async cancelFund(@Body() cancellationDto: CancellationDto) {
    this.logger.log(`Cancelando suscripción al fondo: ${JSON.stringify(cancellationDto)}`);
    return this.fundSubscriptionsService.cancelFund(cancellationDto);
  }

}
