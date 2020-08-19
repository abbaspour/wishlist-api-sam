const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.getItemsHandler = async (event) => {

    if (event.requestContext.http.method !== 'GET') {
        throw new Error('getItemsHandler only accept GET method.');
    }

    const user_id = event.requestContext.authorizer.jwt.claims.sub;

    let params = {
        TableName: tableName,
        KeyConditionExpression: 'user_id = :user_id',
        ExpressionAttributeValues: {':user_id': user_id},
    };

    const data = await docClient.query(params).promise();

    const response = {
        statusCode: 200,
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(data)
    };

    console.info(`response from: ${event.rawPath} statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
