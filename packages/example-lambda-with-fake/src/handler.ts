import type { APIGatewayProxyHandlerV2 } from "aws-lambda";
import { fakeDataSender } from "fake-data-sender";

type Response = {
  result: boolean;
};

const realThing = async (...args) => {
  console.log("running the real thing!", args);
};
const getFunction = (invocationId: string) => {
  if (process.env.WITH_FAKE === "true") {
    return async (...args) => {
      //TODO get the lambda names and invocationIds from context/env
      await fakeDataSender({
        parametersStringified: JSON.stringify(args),
        invocationId,
      });
    };
  } else {
    return realThing;
  }
};

export const handler: APIGatewayProxyHandlerV2<Response> = async (
  event,
  context
) => {
  const myFunction = getFunction(context.awsRequestId);
  await myFunction({ something: true, someString: "hello xolv.io" });
  return {
    result: true,
  };
};
