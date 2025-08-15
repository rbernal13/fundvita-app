import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient } from '@aws-sdk/lib-dynamodb';
import { Injectable } from '@nestjs/common';

@Injectable()
export class DynamoDBService {
    private readonly client: DynamoDBDocumentClient;
    
    constructor() {
        this.client = new DynamoDBClient({
            region: process.env.AWS_REGION || 'us-east-1',
            endpoint: process.env.DYNAMODB_ENDPOINT || undefined,
            credentials: {
                accessKeyId: process.env.AWS_ACCESS_KEY_ID || 'dummy',
                secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY || 'dummy',
            },
        });
    }
    
    getClient() {
        return this.client;
    }
}
