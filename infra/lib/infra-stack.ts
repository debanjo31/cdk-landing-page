import * as cdk from "aws-cdk-lib";
import { Construct } from "constructs";
import {
  CodePipeline,
  CodePipelineSource,
  ManualApprovalStep,
  ShellStep,
  CodeBuildStep,
} from "aws-cdk-lib/pipelines";
import {
  BuildEnvironment,
  BuildSpec,
  ComputeType,
  LinuxBuildImage,
} from "aws-cdk-lib/aws-codebuild";
import { CfnBucket } from "aws-cdk-lib/aws-s3";
import { CfnKey } from "aws-cdk-lib/aws-kms";
import { AwsSolutionsChecks, NagSuppressions } from "cdk-nag";
import { Aspects, Fn, StageProps } from "aws-cdk-lib";
import { StagingDistributionStage } from "./staging-distribution-stage";
import { PrimaryDistributionStage } from "./primary-distribution-stage";
import { PromoteDistributionPipelineStep } from "./promotedist-stepfunction-step";
import { UpdateDistributionPipelineStep } from "./updatedist-stepfunction-step";
import { StepFunctionStack } from "./stepfunction-stack";
import {
  PipelineExportNames,
  PipelineInputVariables,
} from "./pipeline-input-variables";

export class InfraStack extends cdk.Stack {
  constructor(scope: Construct, id: string, props?: cdk.StackProps) {
    super(scope, id, props);

    const pipeline = new CodePipeline(this, "Pipeline", {
      pipelineName: PipelineInputVariables.PIPELINE_NAME,
      synth: new CodeBuildStep("Synth", {
        input: this.getCodePipelineSource(),
        commands: [
          // Install TypeScript globally first
          "npm install -g typescript",

          // Build React app first
          "echo 'Building React application...'",
          "node --version",
          "npm --version",
          "rm -rf node_modules package-lock.json", // Clean slate
          // Ensure devDependencies (like @vitejs/plugin-react) are installed even when NODE_ENV=production
          "npm install --include=dev", // Fresh install including dev deps
          "echo 'Verifying @vitejs/plugin-react installation...'",
          "ls -la node_modules/@vitejs/ || echo 'Plugin not found!'",
          "npm run build", // Creates dist/ folder
          "echo 'React build complete'",
          "ls -la dist/",

          // Then build CDK infrastructure
          "echo 'Building CDK infrastructure...'",
          "cd infra",
          "npm ci --include=dev",
          "npm run build",
          "npx cdk synth",
        ],
        primaryOutputDirectory: "infra/cdk.out",
        env: {
          NODE_ENV: "production",
          CDK_DEFAULT_ACCOUNT: props?.env?.account || "",
          CDK_DEFAULT_REGION: props?.env?.region || "",
          NPM_CONFIG_AUDIT: "false",
          NPM_CONFIG_FUND: "false",
        },
        buildEnvironment: {
          buildImage: LinuxBuildImage.STANDARD_7_0,
          computeType: ComputeType.MEDIUM,
          privileged: false,
        },
        // Specify Node.js 20 runtime for Vite compatibility
        partialBuildSpec: BuildSpec.fromObject({
          version: "0.2",
          phases: {
            install: {
              "runtime-versions": {
                nodejs: "20",
              },
            },
          },
        }),
      }),
      crossAccountKeys: true,
      selfMutation: true,
    });

    const stepFunctionStack = new StepFunctionStack(
      this,
      "cf-promotion-pipeline-step-function",
      props
    );

    // Note: set continuous deployment to false for the first time to deploy the primary distribution
    const continousDeployment =
      PipelineInputVariables.ENABLE_CONTINUOUS_DEPLOYMENT;

    if (continousDeployment) {
      this.createContinuousDeployment(
        pipeline,
        stepFunctionStack.stepFunctionName,
        props
      );
    } else {
      this.createPrimaryDistribution(pipeline);
    }

    Aspects.of(this).add(
      new AwsSolutionsChecks({
        verbose: true,
        reports: true,
      })
    );

    pipeline.buildPipeline();

    const artifactBucket = pipeline.pipeline.artifactBucket.node
      .defaultChild as CfnBucket;
    artifactBucket.loggingConfiguration = {
      logFilePrefix: "artifact_access_log",
    };
    artifactBucket.versioningConfiguration = { status: "Enabled" };

    if (pipeline.pipeline.artifactBucket.encryptionKey) {
      const key = pipeline.pipeline.artifactBucket.encryptionKey.node
        .defaultChild as CfnKey;
      key.enableKeyRotation = true;
    }

    NagSuppressions.addResourceSuppressions(
      pipeline,
      [
        {
          id: "AwsSolutions-IAM5",
          reason:
            "Wildcard IAM permissions are used by auto-created Codepipeline policies and custom policies to allow flexible creation of resources",
        },
      ],
      true
    );
  }

  private getCodePipelineSource(): cdk.pipelines.IFileSetProducer | undefined {
    // using GitHub repository with CodeConnections
    // Make sure to replace 'your-connection-arn' with your actual CodeConnection ARN
    return CodePipelineSource.connection(
      PipelineInputVariables.PIPELINE_CODE_REPO, // Should be in format: owner/repo-name
      PipelineInputVariables.PIPELINE_CODE_BRANCH,
      {
        connectionArn: PipelineInputVariables.GITHUB_CONNECTION_ARN,
      }
    );
  }

  createPrimaryDistribution(
    pipeline: CodePipeline,
    props?: StageProps,
    stackProps?: cdk.StackProps
  ): void {
    const primaryDistribution = new PrimaryDistributionStage(
      this,
      "PrimaryDistribution-Change",
      stackProps
    );

    const stage = pipeline.addStage(primaryDistribution);

    stage.addPost(
      new ShellStep("test distribution", {
        envFromCfnOutputs: {
          distributionDomainName:
            primaryDistribution.primaryDistributionStack
              .distributionDomainNameOutput,
        },
        commands: ['curl -v "https://$distributionDomainName"'],
      })
    );
  }

  createContinuousDeployment(
    pipeline: CodePipeline,
    stepFunctionName: string,
    props?: cdk.StackProps
  ): void {
    if (!props || !props.env) {
      throw Error(
        "Account and Region are required if continuous deployment is enabled. Please uncomment or pass env in file cf-cd-sample-app.ts"
      );
    }

    const stageDistribution = new StagingDistributionStage(
      this,
      "StagingDistribution-Change",
      props
    );
    pipeline.addStage(stageDistribution);

    const updateDeploymentPolicyWave = pipeline.addWave(
      "Update-DeploymentPolicy"
    );
    const primaryDistributionId = Fn.importValue(
      PipelineExportNames.PRIMARY_DISTRIBUTION_ID
    );

    // use step function to avoid over-writing primary distribution configuration with old configuration
    // and update primary distribution to attach deployment policy id.
    const updateStep = new UpdateDistributionPipelineStep(
      primaryDistributionId,
      stepFunctionName,
      props.env,
      stageDistribution.stagingDeploymentPolicyOutput
    );
    const manualStep = new ManualApprovalStep(
      "Approve-Promote-StagingDistribution",
      {
        comment:
          "Validate and approve staging distribution changes. Promote step will promote staging configuration changes to primary distribution.",
      }
    );
    manualStep.addStepDependency(updateStep);

    updateDeploymentPolicyWave.addPost(updateStep, manualStep);

    pipeline
      .addWave("Promote-StagingDistribution")
      .addPost(
        new PromoteDistributionPipelineStep(
          primaryDistributionId,
          stageDistribution.stagingDistributionOutput,
          stepFunctionName,
          props.env
        )
      );
  }

  addAspect(construct: Construct): void {
    Aspects.of(construct).add(
      new AwsSolutionsChecks({
        verbose: true,
        reports: true,
      })
    );
  }
}
