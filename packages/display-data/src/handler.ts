import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import {
  DataItem,
  DataRepository,
} from "@fake-data/add-data/src/domain/data-table-repository";

type Response = {
  result: DataItem[];
};

export const handler: APIGatewayProxyHandlerV2<Response> = async (event) => {
  const dataRepository = new DataRepository(process.env.DATA_TABLE);

  const lambdaName = event.queryStringParameters.lambdaName;
  const item = await dataRepository.queryByLambdaName(lambdaName);
  return {
    result: item,
  };
};
