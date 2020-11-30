import {App, Stack} from "@aws-cdk/core"
import {TypeScriptFunction} from "cdk-typescript-tooling";

function createAddService(stack: Stack) {
  new TypeScriptFunction(stack, "Add-Function", {
    entry: require.resolve("@calculator/add/src/handler.ts"),
    withHttp: true
  })
}

function createMultiplyService(stack: Stack) {
  new TypeScriptFunction(stack, "Multiply-Function", {
    entry: require.resolve("@calculator/multiply/src/handler.ts"),
    withHttp: true
  })
}

export class Calculator extends Stack {
  constructor(app: App, stackName: string) {
    super(app, stackName)
    createAddService(this)
    createMultiplyService(this)
  }
}
