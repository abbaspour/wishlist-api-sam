const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const jwtDecode = require('jwt-decode');
const docClient = new dynamodb.DocumentClient();

exports.deleteItemHandler = async (event, context) => {

  if (event.requestContext.http.method !== 'DELETE') {
    throw new Error(`deleteItemHandler only accept DELETE method. event: ${JSON.toSource(event)}`);
  }

  const authorizationHeader = event.headers.authorization || '';
  const TokenArray = authorizationHeader.split(' ');
  if(TokenArray.length !== 2) {
    throw new Error(`header is invalid: ${authorizationHeader}`);
  }

  const decodedHeader = jwtDecode(TokenArray[1]);

  const user_id = decodedHeader.sub;
  const id = event.pathParameters.id;

  let params = {
    TableName : tableName,
    Key: {
      user_id: user_id,
      id: id
    }
  };

  const data = await docClient.delete(params).promise();
  console.log(`data from scanning table ${tableName} with user_id: ${user_id}, id: ${id}: ${JSON.stringify(data)}`);

  const response = {
    statusCode: 202,
    headers: {
      "Content-Type": "application/json",
    },
  };

  console.info(`response from: ${event.rawPath} statusCode: ${response.statusCode} `);
  return response;
}
