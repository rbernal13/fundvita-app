import { Controller, Get, Post, Body, Patch, Param, Delete, Logger } from '@nestjs/common';
import { FundsService } from './funds.service';
import { CreateFundDto } from './dto/create-fund.dto';
import { UpdateFundDto } from './dto/update-fund.dto';

@Controller('funds')
export class FundsController {

  private readonly logger = new Logger(FundsController.name);

  constructor(private readonly fundsService: FundsService) {}

  @Post()
  create(@Body() createFundDto: CreateFundDto) {
    this.logger.log('Creando fondo de inversión...');
    return this.fundsService.create(createFundDto);
  }

  @Get()
  findAll() {
    this.logger.log('Buscando todos los fondos de inversión...');
    return this.fundsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    this.logger.log(`Buscando fondo de inversión con ID: ${id}`);
    return this.fundsService.findOne(id);
  }
}
