import { DynamoDB } from "aws-sdk";
import { createTable, generateRandomName } from "dynamodb-testing-tool";
import { DataRepository } from "./data-table-repository";
import { DataTableDefinitionSdk } from "./data-table-definition";

let repository: DataRepository;

beforeEach(async () => {
  const dynamoSchema: DynamoDB.CreateTableInput = {
    TableName: generateRandomName(),
    ...DataTableDefinitionSdk,
  };
  const tableObject = await createTable(dynamoSchema);
  repository = new DataRepository(
    tableObject.tableName,
    // there are some aws-sdk mismatches here, since we are in tests
    // I'm ignoring this for now.
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    tableObject.documentClient
  );

  const putCacheItem = ({
    invocationId,
    lambdaName,
  }: {
    invocationId: string;
    lambdaName: string;
  }) => {
    const newVar = {
      RequestItems: {
        [tableObject.tableName]: [
          {
            PutRequest: {
              Item: {
                lambdaName,
                invocationId,
              },
            },
          },
        ],
      },
    };
    return tableObject.documentClient.batchWrite(newVar).promise();
  };

  await Promise.all([
    putCacheItem({
      lambdaName: "successful",
      invocationId: "1",
    }),
    putCacheItem({
      lambdaName: "failed",
      invocationId: "2",
    }),
    putCacheItem({
      lambdaName: "another-success",
      invocationId: "3",
    }),
  ]);
});

test("Finding by lambdaName", async () => {
  const result = await repository.queryByLambdaName("successful");
  expect(result).toEqual([
    {
      lambdaName: "successful",
      invocationId: "1",
    },
  ]);
});

test("Adding and finding by lambdaName", async () => {
  const toAdd = {
    lambdaName: "added",
    invocationId: "someId",
    parametersStringified: "someParameters",
  };
  await repository.add(toAdd);
  const result = await repository.queryByLambdaName("added");
  expect(result).toHaveLength(1);
  expect(result[0]).toMatchObject(toAdd);
});
