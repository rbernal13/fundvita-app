# Creacion del Docker para DynamoDB 

docker run -d --name dynamodb-local -p 8000:8000 amazon/dynamodb-local

Si se require persistencia de datos de forma local, entonces:

docker run -d --name dynamodb-local -p 8000:8000 -v ${PWD}\dynamodb-data:/home/dynamodblocal/data amazon/dynamodb-local -jar DynamoDBLocal.jar -sharedDb -dbPath /home/dynamodblocal/data



# Creacion de tablas

## Users

aws dynamodb create-table --table-name Users --attribute-definitions AttributeName=userId,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

## Funds (Fondos de Inversion)

aws dynamodb create-table --table-name Funds --attribute-definitions AttributeName=fundId,AttributeType=S --key-schema AttributeName=fundId,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

## FundSubscriptions (Subscripciones activas)

aws dynamodb create-table --table-name FundSubscriptions --attribute-definitions AttributeName=userId,AttributeType=S  AttributeName=createdAt,AttributeType=S --key-schema AttributeName=userId,KeyType=HASH AttributeName=createdAt,KeyType=RANGE --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

## History (Historial o registro de transacciones/subscripciones/aperturas/cancelaciones)

aws dynamodb create-table --table-name History --attribute-definitions AttributeName=userId,AttributeType=S --key-schema AttributeName=historyId,KeyType=HASH --billing-mode PAY_PER_REQUEST --endpoint-url http://localhost:8000 --region us-east-1

# Alimentar tablas (Inserts)

## Agregar Usuario con saldo

aws dynamodb put-item --table-name Users --item '{\"userId\": {\"S\": \"u1\" }, \"name\": { \"S\": \"Juan\" },\"email\": { \"S\": \"juan-testuser01@yopmail.com\" }, \"balance\": {\"N\": \"500000\" } }' --endpoint-url http://localhost:8000

## Agregar fondos de inversion

aws dynamodb put-item --table-name Funds --item '{\"fundId\": {\"S\": \"1\" }, \"name\": { \"S\": \"FPV_EL CLIENTE_RECAUDADORA\" }, \"minInvestment\": { \"N\": \"75000\" }, \"category\": { \"S\": \"FPV\" }}' --endpoint-url http://localhost:8000

aws dynamodb put-item --table-name Funds --item '{ \"fundId\": { \"S\": \"2\" }, \"name\": { \"S\": \"FPV_EL CLIENTE_ECOPETROL\" }, \"minInvestment\": { \"N\": \"125000\" }, \"category\": { \"S\": \"FPV\" }}' --endpoint-url http://localhost:8000

aws dynamodb put-item --table-name Funds --item '{ \"fundId\": { \"S\": \"3\" }, \"name\": { \"S\": \"DEUDAPRIVADA\" }, \"minInvestment\": { \"N\": \"50000\" }, \"category\": { \"S\": \"FIC\" }}' --endpoint-url http://localhost:8000

aws dynamodb put-item --table-name Funds --item '{ \"fundId\": { \"S\": \"4\" }, \"name\": { \"S\": \"FDO-ACCIONES\" }, \"minInvestment\": { \"N\": \"250000\" }, \"category\": { \"S\": \"FIC\" }}' --endpoint-url http://localhost:8000

aws dynamodb put-item --table-name Funds --item '{ \"fundId\": { \"S\": \"5\" }, \"name\": { \"S\": \"FPV_EL CLIENTE_DINAMICA\" }, \"minInvestment\": { \"N\": \"100000\" }, \"category\": { \"S\": \"FPV\" }}' --endpoint-url http://localhost:8000