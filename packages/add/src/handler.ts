import type { APIGatewayProxyHandlerV2 } from "aws-lambda";

type Response = {
  result: number
}

export const handler: APIGatewayProxyHandlerV2<Response> = async (event) => {
  return {result: parseInt(event.queryStringParameters.a) + parseInt(event.queryStringParameters.b)}
}
