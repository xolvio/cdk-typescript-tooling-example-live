import { DynamoDB } from "aws-sdk";

export type DataItem = {
  lambdaName: string;
  invocationId: string;
  parametersStringified: string;
};

export class DataRepository {
  constructor(
    private tableName: string,
    private documentClient = new DynamoDB.DocumentClient()
  ) {}

  async queryByLambdaName(lambdaName: string): Promise<DataItem[]> {
    const result = await this.documentClient
      .query({
        TableName: this.tableName,
        KeyConditionExpression: `lambdaName = :lambdaName`,
        ExpressionAttributeValues: {
          ":lambdaName": lambdaName,
        },
      })
      .promise();
    return result.Items as DataItem[];
  }
  async add(item: DataItem) {
    await this.documentClient
      .put({
        TableName: this.tableName,
        Item: { ...item, timestamp: new Date().valueOf() },
      })
      .promise();
  }
}
