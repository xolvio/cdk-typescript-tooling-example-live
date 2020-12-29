import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { DataItem, DataRepository } from "./domain/data-table-repository";

type Response = {
  result: string;
};

export const handler: APIGatewayProxyHandlerV2<Response> = async (event) => {
  const dataRepository = new DataRepository(process.env.DATA_TABLE);

  const dataItem: DataItem = {
    invocationId: event.queryStringParameters.invocationId,
    lambdaName: event.queryStringParameters.lambdaName,
    parametersStringified: event.queryStringParameters.parametersStringified,
  };

  await dataRepository.add(dataItem);

  return {
    result: "added successfully!",
  };
};
