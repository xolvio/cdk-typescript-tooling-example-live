import { CfnTableProps } from "@aws-cdk/aws-dynamodb";
import { dynamoCdkToSdk } from "@fake-data/cdk/src/helpers/dynamoCdkToSdk";

export const DataTableDefinition: CfnTableProps = {
  attributeDefinitions: [
    {
      attributeType: "S",
      attributeName: "lambdaName",
    },
    {
      attributeType: "N",
      attributeName: "timestamp",
    },
  ],
  keySchema: [
    {
      attributeName: "lambdaName",
      keyType: "HASH",
    },
    {
      attributeName: "timestamp",
      keyType: "RANGE",
    },
  ],
  billingMode: "PAY_PER_REQUEST",
};

export const DataTableDefinitionSdk = dynamoCdkToSdk(DataTableDefinition);
