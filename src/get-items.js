const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();
const userId = require('./user-id.js');

exports.getItemsHandler = async (event, context) => {

  if (event.requestContext.http.method !== 'GET') {
    throw new Error(`getItemsHandler only accept GET method. event: ${JSON.toSource(event)}`);
  }

  const user_id = userId.getUserId(event);

  let params = {
    TableName : tableName,
    KeyConditionExpression: 'user_id = :user_id',
    ExpressionAttributeValues: { ':user_id': user_id },
  };

  const data = await docClient.query(params).promise();

  const response = {
    statusCode: 200,
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data)
  };

  console.info(`response from: GET ${event.rawPath}, user_id: ${user_id}, statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
