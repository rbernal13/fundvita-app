import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { DynamoDBService } from 'src/common/dynamodb/dynamodb.service';
import { GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';
import { unmarshall } from '@aws-sdk/util-dynamodb';

@Injectable()
export class UsersService {
  private tableName: string = 'Users';

  constructor(
    private readonly dynamoDBService: DynamoDBService
  ) { }

  async create(createUserDto: CreateUserDto) {
    await this.dynamoDBService.getClient().send(
      new PutCommand({
        TableName: this.tableName,
        Item: createUserDto,
      }),
    );
    return createUserDto;
  }

  async findOne(userId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new GetCommand({
        TableName: this.tableName,
        Key: { userId },
      }),
    );

    const item = result.Item ? unmarshall(result.Item) : null;
    return item;
  }
}
