const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const userId = require('./user-id.js');

const docClient = new dynamodb.DocumentClient();

exports.deleteItemHandler = async (event) => {

  if (event.requestContext.http.method !== 'DELETE') {
    throw new Error(`deleteItemHandler only accept DELETE method. event: ${JSON.toSource(event)}`);
  }

  const user_id = userId.getUserId(event);
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

  console.info(`response from: DELETE ${event.rawPath}, user_id: ${user_id}, id: ${id}, statusCode: ${response.statusCode}`);
  return response;
}
