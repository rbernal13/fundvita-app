import { ConflictException, Injectable, InternalServerErrorException, NotFoundException, Query } from '@nestjs/common';
import { OpeningDto } from './dto/opening.dto';
import { CancellationDto } from './dto/cancellation.dto';
import { InternalServerError, QueryCommand, ScanCommand } from '@aws-sdk/client-dynamodb';
import { DynamoDBService } from 'src/common/dynamodb/dynamodb.service';
import { GetCommand, PutCommand, TransactWriteCommand } from '@aws-sdk/lib-dynamodb';
import { FundSubscriptionEntity } from './entities/fund-subscription.entity';
import { marshallInput } from '@aws-sdk/lib-dynamodb/dist-types/commands/utils';
import { marshall, unmarshall } from '@aws-sdk/util-dynamodb';
import { HistoryEntity } from 'src/history/entities/history.entity';

@Injectable()
export class FundSubscriptionsService {

  private usersTable: string = "Users";
  private fundsTable: string = "Funds";
  private subsTable: string = "FundSubscriptions";
  private historyTable: string = "History";

  constructor(private readonly dynamoDBService: DynamoDBService) { }

  async getFundSubscriptionsByUser(userId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new QueryCommand({
        TableName: this.subsTable,
        KeyConditionExpression: "userId = :u",
        ExpressionAttributeValues: {
          ":u": { S: userId } // S para indicar que es string
        }
      })
    );

    //Convertir a JSON
    const items = result.Items?.map(item => unmarshall(item)) || [];
    return items;
  }

  // Servicio para subscribirse - apertura
  async subscribeFund(openingDto: OpeningDto) {
    // 1. Verificar el usuario, el fondo de inversion, el monto y el balance del usuario
    try {
      const [user, fund] = await Promise.all([
        this.getUser(openingDto.userId),
        this.getFund(openingDto.fundId)
      ]);

      if (!user) throw new NotFoundException('Usuario no encontrado');

      if (!fund) throw new NotFoundException('Fondo de inversion no encontrado');

      if (user.balance < fund.minInvestment) {
        throw new ConflictException('Balance insuficiente para realizar el apertura o subscripcion al fondo de inversion');
      }

      // 2. Verificar si el usuario ya esta suscrito al fondo
      const existingSubscription = await this.getFundSubscriptions(openingDto.userId, openingDto.fundId);
      if (existingSubscription) {
        throw new ConflictException('El usuario ya esta suscrito a este fondo');
      }

      // 3. Crear la subscripcion/apertura
      await this.dynamoDBService.getClient().send(
        new TransactWriteCommand({
          TransactItems: [
            {
              // Se agrega una suscripción activa a la tabla
              Put: {
                TableName: this.subsTable,
                Item: {
                  userId: openingDto.userId,
                  fundId: openingDto.fundId,
                  subscriptionDate: new Date().toISOString(),
                },
              },
            },
            {
              // Se actualiza el balance del usuario después de la apertura/suscripción
              Update: {
                TableName: this.usersTable,
                Key: { userId: openingDto.userId }, // Key como string
                UpdateExpression: "SET balance = balance - :amount",
                ConditionExpression: 'attribute_exists(userId) AND balance >= :amount',
                ExpressionAttributeValues: { ':amount': Number(fund.minInvestment) }, // valor tipo number
              },
            },
            {
              // Se agrega la transacción o registro al historial
              Put: {
                TableName: this.historyTable,
                Item: {
                  historyId: crypto.randomUUID(),
                  userId: openingDto.userId,
                  fundId: openingDto.fundId,
                  amount: fund.minInvestment,
                  type: "Apertura",
                  createdAt: new Date().toISOString(),
                },
              },
            },
          ],
        })
      );

    } catch (error) {
      console.error('Error al procesar la apertura:', error);
      throw new InternalServerErrorException('Error al procesar la apertura: ' + error.message);
    }

    return { ok: true, message: 'Apertura exitosa' };
  }

  // Servicio para cancelar - cancelacion
  async cancelFund(cancellationDto: CancellationDto) {
    // 1. Verificar el usuario, el fondo de inversion y la subscripcion

    const [user, fund, sub] = await Promise.all([
      this.getUser(cancellationDto.userId),
      this.getFund(cancellationDto.fundId),
      this.getFundSubscriptions(cancellationDto.userId, cancellationDto.fundId)
    ]);

    if (!user) throw new NotFoundException('Usuario no encontrado');

    if (!fund) throw new NotFoundException('Fondo de inversion no encontrado');

    if (!sub) throw new NotFoundException('Suscripcion (Apertura) no encontrada');

    const returningAmount = fund.minInvestment; // Monto a devolver al usuario

    const history: HistoryEntity = {
      historyId: crypto.randomUUID(),
      userId: cancellationDto.userId,
      fundId: cancellationDto.fundId,
      amount: returningAmount,
      type: 'Cancelacion',
      createdAt: new Date().toISOString()
    };

    // 3. Salir del fondo/cancelacion
    try {
      await this.dynamoDBService.getClient().send(
        new TransactWriteCommand({
          TransactItems: [
            { // Se elimina la subscripcion activa de la tabla
              Delete: {
                TableName: this.subsTable,
                Key: {
                  userId: cancellationDto.userId,
                  fundId: cancellationDto.fundId
                }
              }
            },
            { // Se actualiza el balance del usuario
              Update: {
                TableName: this.usersTable,
                Key: { userId: cancellationDto.userId },
                UpdateExpression: "SET balance = balance + :amount",
                ConditionExpression: 'attribute_exists(userId)',
                ExpressionAttributeValues: { ':amount': Number(returningAmount) },
              }
            },
            { // Se agrega la transaccion o registro al historial de aperturas/cancelaciones
              Put: {
                TableName: this.historyTable,
                Item: {
                  historyId: crypto.randomUUID(),
                  userId: cancellationDto.userId,
                  fundId: cancellationDto.fundId,
                  amount: returningAmount,
                  type: 'Cancelacion',
                  createdAt: new Date().toISOString()
                },
              }
            }
          ]
        })
      );

    } catch (error) {
      throw new InternalServerErrorException('Error al procesar la cancelacion: ' + error.message);
    }

    return { ok: true, message: 'Cancelacion exitosa' };
  }

  // Buscar usuario por ID
  async getUser(userId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new GetCommand({
        TableName: this.usersTable,
        Key: { userId },
      }),
    );
    return result.Item;
  }

  // Buscar fondo de inversion por ID
  async getFund(fundId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new GetCommand({
        TableName: this.fundsTable,
        Key: { fundId },
      }),
    );
    return result.Item;
  }

  // Buscar suscripciones de fondos por ID del usuario y ID del fondo de inversion
  async getFundSubscriptions(userId: string, fundId: string) {
    const result = await this.dynamoDBService.getClient().send(
      new GetCommand({
        TableName: this.subsTable,
        Key: {
          userId,
          fundId
        },
      }),
    );
    return result.Item;
  }

}
