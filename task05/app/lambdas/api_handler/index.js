const { v4: uuidv4 } = require('uuid');
const AWS = require('aws-sdk');
 
const dynamoDb = new AWS.DynamoDB.DocumentClient();
const TABLE_NAME = 'Events';
 
exports.handler = async (event) => {
    try {
        const requestBody = JSON.parse(event.body);
 
        if (!requestBody.principalId || !requestBody.content) {
            return {
                statusCode: 400,
                body: JSON.stringify({ message: "Missing required fields: principalId or content" }),
            };
        }
 
        const newEvent = {
            id: uuidv4(),
            principalId: requestBody.principalId,
            createdAt: new Date().toISOString(),
            body: requestBody.content,
        };
 
        await dynamoDb.put({
            TableName: TABLE_NAME,
            Item: newEvent,
        }).promise();
 
        return {
            statusCode: 201,
            body: JSON.stringify({ event: newEvent }),
        };
    } catch (error) {
        console.error("Error saving event:", error);
        return {
            statusCode: 500,
            body: JSON.stringify({ message: "Internal Server Error" }),
        };
    }
};