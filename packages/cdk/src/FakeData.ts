import { App, Stack } from "@aws-cdk/core";
import * as dynamodb from "@aws-cdk/aws-dynamodb";
import { TypeScriptFunction } from "cdk-typescript-tooling";
import { DataTableDefinition } from "@fake-data/add-data/src/domain/data-table-definition";
import { ITable } from "@aws-cdk/aws-dynamodb";

function createAddService(stack: Stack, table: ITable) {
  const handle = new TypeScriptFunction(stack, "Add-Data-Function", {
    entry: require.resolve("@fake-data/add-data/src/handler.ts"),
    withHttp: true,
    environment: {
      DATA_TABLE: table.tableName,
    },
  });

  table.grantReadWriteData(handle);
  // TODO change this in TypeScriptFunction - expose url
  // @ts-ignore
  return handle.url;
}

function createMultiplyService(stack: Stack, table: ITable) {
  const handle = new TypeScriptFunction(stack, "Display-Data-Function", {
    entry: require.resolve("@fake-data/display-data/src/handler.ts"),
    withHttp: true,
    environment: {
      DATA_TABLE: table.tableName,
    },
  });

  table.grantReadWriteData(handle);
}

function createTable(stack: Stack) {
  const cfn = new dynamodb.CfnTable(stack, "Data", {
    ...DataTableDefinition,
  });

  return dynamodb.Table.fromTableAttributes(stack, "Data-Table", {
    tableArn: cfn.attrArn,
  });
}

function createExampleLambdaWithFake(stack: Stack, addServiceUrl: string) {
  new TypeScriptFunction(stack, "Example-Function-With-Fake", {
    entry: require.resolve(
      "@fake-data/example-lambda-with-fake/src/handler.ts"
    ),
    withHttp: true,
    environment: {
      WITH_FAKE: "true",
      ADD_FAKE_DATA_URL: addServiceUrl,
    },
  });
}

export class FakeData extends Stack {
  constructor(app: App, stackName: string) {
    super(app, stackName);
    const table = createTable(this);
    const addServiceUrl = createAddService(this, table);
    createMultiplyService(this, table);

    createExampleLambdaWithFake(this, addServiceUrl);
  }
}
