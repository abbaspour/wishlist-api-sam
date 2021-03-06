const tableName = process.env.TABLE_NAME;

const dynamodb = require('aws-sdk/clients/dynamodb');
const docClient = new dynamodb.DocumentClient();

exports.postItemHandler = async (event, context) => {

    if (event.requestContext.http.method !== 'POST') {
        throw new Error('postItemHandler only accept POST method');
    }

    const user_id = event.requestContext.authorizer.jwt.claims.sub;
    const id = context.awsRequestId;

    const {name, url, description} = JSON.parse(event.body);

    await docClient.put({
        TableName: tableName,
        Item: {user_id: user_id, id: id, name, url, description}
    }).promise();

    const response = {
        statusCode: 201,
        body: JSON.stringify({id: id}),
        headers: {"Content-Type": "application/json"}
    };

    console.info(`response from: POST ${event.rawPath}, user_id: ${user_id}, name: ${name}, statusCode: ${response.statusCode} body: ${response.body}`);
    return response;
}
