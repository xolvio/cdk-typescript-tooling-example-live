#!/usr/bin/env node
import * as cdk from "@aws-cdk/core";
import { FakeData } from "./FakeData";

const app = new cdk.App();

export default new FakeData(app, "FakeData");
