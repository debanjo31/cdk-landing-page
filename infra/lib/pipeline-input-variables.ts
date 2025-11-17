// Copyright Amazon.com, Inc. or its affiliates. All Rights Reserved.
// SPDX-License-Identifier: MIT-0

export const PipelineInputVariables = {
  // Pipeline variables
  PIPELINE_CODE_REPO: "debanjo31/cdk-landing-page", // Change this to your GitHub repo in format: owner/repo-name
  PIPELINE_CODE_BRANCH: "master",
  GITHUB_CONNECTION_ARN:
    "arn:aws:codeconnections:us-east-1:590183693606:connection/823cb8a6-d4b2-4d4b-9eb1-43068d8c573d", // Replace with your actual CodeConnection ARN

  PIPELINE_NAME: "debanjo-pipeline",
  // prefix
  STEP_FUNCTION_NAME: "ipelineStepFunction",

  ENABLE_CONTINUOUS_DEPLOYMENT: false,
  HEADER_BASED_TRAFFIC_CONFIG: true,

  // site access logs bucket name
  LOG_BUCKET_NAME: "mysite-logs",
};

export const PipelineExportNames = {
  STEP_FUNCTION_ROLE_ARN: `${PipelineInputVariables.PIPELINE_NAME}-cd-pipeline-stepfunction-roleArn`,

  PRIMARY_DISTRIBUTION_ID: `${PipelineInputVariables.PIPELINE_NAME}-primary-distribution-id`,

  STAGING_DISTRIBUTION_ID: `${PipelineInputVariables.PIPELINE_NAME}-staging-distribution-id`,
  DEPLOYMENT_POLICY_ID: `${PipelineInputVariables.PIPELINE_NAME}-staging-deployment-policy-id`,
};
