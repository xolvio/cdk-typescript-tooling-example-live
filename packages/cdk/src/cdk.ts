#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { Calculator } from "./Calculator";

const app = new cdk.App();

export default new Calculator(app, "Calculator");
