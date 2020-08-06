const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const jwtDecode = require('jwt-decode');
const docClient = new dynamodb.DocumentClient();

exports.postItemHandler = async (event, context) => {

  if (event.requestContext.http.method !== 'POST') {
    throw new Error(`postItemHandler only accept GET method. event: ${JSON.toSource(event)}`);
  }

  const authorizationHeader = event.headers.authorization || '';
  const TokenArray = authorizationHeader.split(' ');
  if(TokenArray.length !== 2) {
    throw new Error(`header is invalid: ${authorizationHeader}`);
  }

  const decodedHeader = jwtDecode(TokenArray[1]);
  console.info('received decodedHeader:', decodedHeader);

  const user_id = decodedHeader.sub;
  const id = context.awsRequestId;

  const {name, url, description} = JSON.parse(event.body);

  await docClient.put({
    TableName: tableName,
    Item: {
      user_id: user_id,
      id: id,
      name,
      url,
      description
    }
  }).promise();

  const response = {
    statusCode: 201,
    body: JSON.stringify({
      id: id
    }),
    headers: {
      "Content-Type": "application/json",
    }
  }

  console.info(`response from: ${event.rawPath} statusCode: ${response.statusCode} body: ${response.body}`);
  return response;
}
