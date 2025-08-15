import { Injectable } from '@nestjs/common';
import { DynamoDBService } from 'src/common/dynamodb/dynamodb.service';
import { ScanCommand } from '@aws-sdk/client-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class HistoryService {

  private tableName: string = 'History';

  constructor(private readonly dynamoDBService: DynamoDBService) { }

  // async create(createHistoryDto: CreateHistoryDto) {
  //   await this.dynamoDBService.getClient().send(
  //     new PutCommand({
  //       TableName: this.tableName,
  //       Item: createHistoryDto,
  //     }),
  //   );
  // }

  async findAll() {
    const result = await this.dynamoDBService.getClient().send(
      new ScanCommand({
        TableName: this.tableName,
      }),
    );

    //Convertir a JSON
    const items = result.Items?.map(item => unmarshall(item)) || [];

    //Ordenar
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return items;
  }

  async findHistoryByUser(userId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new ScanCommand({
        TableName: this.tableName,
        FilterExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': { S: userId },
        },
      }),
    );

    //Convertir a JSON
    const items = result.Items?.map(item => unmarshall(item)) || [];
    console.log("🚀 ~ HistoryService ~ findHistoryByUser ~ items:", items)

    //Ordenar
    items.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());

    return items;
  }

}
