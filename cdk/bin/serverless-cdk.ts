#!/usr/bin/env node
import "source-map-support/register";
import * as cdk from "aws-cdk-lib";
import { ServerlessCdkStack } from "../lib/serverless-cdk-stack";
require("dotenv").config();

const app = new cdk.App();
new ServerlessCdkStack(app, "ExpressServerlessCdkStack", {
  env: {
    region: process.env.REGION,
  },
});
