#!/usr/bin/env node
import * as cdk from "aws-cdk-lib/core";
import { InfraStack } from "../lib/infra-stack";
import { PipelineInputVariables } from "../lib/pipeline-input-variables";

const app = new cdk.App();
new InfraStack(app, "InfraStack", {
  env: {
    account: PipelineInputVariables.AWS_ACCOUNT,
    region: PipelineInputVariables.AWS_REGION,
  },
});
