const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const jwtDecode = require('jwt-decode');
const docClient = new dynamodb.DocumentClient();

/**
 * A simple example includes a HTTP get method to get all items by id from a DynamoDB table.
 * https://docs.aws.amazon.com/apigateway/latest/developerguide/set-up-lambda-proxy-integrations.html#api-gateway-simple-proxy-for-lambda-input-format
 * https://docs.aws.amazon.com/lambda/latest/dg/nodejs-context.html
 */
exports.getItemsHandler = async (event, context) => {

  if (event.requestContext.http.method !== 'GET') {
    throw new Error(`getItemsHandler only accept GET method. event: ${JSON.toSource(event)}`);
  }

  const authorizationHeader = event.headers.authorization || '';
  const TokenArray = authorizationHeader.split(' ');
  if(TokenArray.length !== 2) {
    throw new Error(`header is invalid: ${authorizationHeader}`);
  }

  const decodedHeader = jwtDecode(TokenArray[1]);
  const user_id = decodedHeader.sub;

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

  console.info(`response from: ${event.rawPath} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
