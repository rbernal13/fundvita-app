import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { CreateFundDto } from './dto/create-fund.dto';
import { DynamoDBService } from 'src/common/dynamodb/dynamodb.service';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { ListTablesCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class FundsService {

  private tableName: string = 'Funds';

  constructor(private readonly dynamoDBService: DynamoDBService) { }

  async create(createFundDto: CreateFundDto) {
    try {
      await this.dynamoDBService.getClient().send(
        new PutCommand({
          TableName: this.tableName,
          Item: createFundDto,
        }),
      );
    } catch (error) {
      console.error('Error al crear el fondo de inversión:', error);
      throw new InternalServerErrorException(
        'No se pudo crear el fondo de inversión. Intente más tarde.',
      );

    }
  }

  async findAll() {
    try {
      const listFunds = await this.dynamoDBService.getClient().send(
        new ScanCommand({
          TableName: this.tableName,
        }),
      );
      //Convertir a JSON
      const items = listFunds.Items?.map(item => unmarshall(item)) || [];
      return items;
    } catch (error) {
      console.error('Error al obtener los fondos de inversiones:', error);
      throw new InternalServerErrorException(
        'No se pudieron obtener los fondos. Intente más tarde.',
      );

    }
  }

  async findOne(fundId: string) {
    try {
      const result = await this.dynamoDBService.getClient().send(
        new GetCommand({
          TableName: this.tableName,
          Key: { fundId },
        }),
      );
      return result.Item;
    } catch (error) {
      console.error('Error al obtener el fondo de inversión:', error);
      throw new InternalServerErrorException(
        'No se pudo obtener el fondo de inversión. Intente más tarde.',
      );
    }
  }
}
