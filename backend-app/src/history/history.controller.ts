import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, Query } from '@nestjs/common';
import { HistoryService } from './history.service';

@Controller('history')
export class HistoryController {
  private readonly logger = new Logger(HistoryController.name);
  constructor(private readonly historyService: HistoryService) { }

  @Get()
  findAll() {
    this.logger.log('Buscando todo el historial');
    return this.historyService.findAll();
  }


  @Get('getHistoryByUser')
  findHistoryByUser(@Query('userId') userId: string) {
    this.logger.log(`Buscando historial para el usuario ${userId}`);
    return this.historyService.findHistoryByUser(userId);
  }


}
