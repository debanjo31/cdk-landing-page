# Blue/Green Deployment for Frontend with AWS CDK

This project demonstrates a robust **Blue/Green Deployment Pipeline** for Single Page Applications (SPAs) using AWS CDK, CloudFront, and AWS Step Functions.

It solves the common problem of "broken user experience during deployments" by ensuring that new versions are fully tested in a staging environment (on the production domain) before being atomically promoted to all users.

## 🚀 Key Features

*   **Zero Downtime Deployments**: Users never see a broken site or mixed assets.
*   **Infrastructure as Code**: Fully defined in TypeScript using AWS CDK.
*   **Safe Testing in Production**: Use **CloudFront Continuous Deployment** to test the new version on the live domain using a secret header.
*   **Atomic Promotion**: AWS Step Functions handle the promotion logic, ensuring an instantaneous swap.
*   **Automated Cache Invalidation**: The pipeline handles CloudFront cache invalidation automatically.

## 🏗 Architecture

The solution uses the following AWS services:
*   **AWS CodePipeline**: Orchestrates the build and deploy process.
*   **Amazon CloudFront**: Serves the application with Continuous Deployment enabled.
*   **Amazon S3**: Stores the static assets (Blue and Green buckets).
*   **AWS Step Functions**: Orchestrates the promotion of the Staging distribution to Primary.

```mermaid
graph TD
    User[User] --> CF[CloudFront Primary]
    CF -->|Default Traffic| Blue[S3 Bucket (Blue/Old)]
    CF -->|Header: aws-cf-cd-test: blue| Green[S3 Bucket (Green/New)]
    
    Pipeline[CodePipeline] -->|Build & Deploy| Green
    Pipeline -->|Manual Approval| StepFunction[Step Function]
    StepFunction -->|Promote| CF
```

## 🛠 Prerequisites

*   Node.js 20+
*   AWS CLI configured with Administrator permissions
*   AWS CDK CLI installed (`npm install -g aws-cdk`)
*   A GitHub repository for your code
*   **AWS CodeConnection**: A connection created in the AWS Console to allow CodePipeline to access your GitHub repo.

## ⚙️ Configuration

1.  Clone the repository.
2.  Navigate to the infrastructure directory:
    ```bash
    cd infra
    ```
3.  Open `lib/pipeline-input-variables.ts` and update the following variables:

    ```typescript
    export const PipelineInputVariables = {
      PIPELINE_CODE_REPO: "your-github-username/your-repo-name",
      PIPELINE_CODE_BRANCH: "master", // or main
      GITHUB_CONNECTION_ARN: "arn:aws:codeconnections:...", // Your AWS CodeConnection ARN
      // ... other variables
    };
    ```

## 🚀 Deployment

1.  **Install Dependencies**:
    ```bash
    npm install
    cd infra
    npm install
    ```

2.  **Initial Deploy**:
    You need to deploy the pipeline stack once manually to create the pipeline in AWS.
    ```bash
    cd infra
    npx cdk deploy InfraStack
    ```

3.  **Continuous Deployment**:
    Once the pipeline is created, any push to your configured branch (e.g., `master`) will automatically trigger the pipeline.

## 🧪 How to Test (The "Green" Phase)

When the pipeline reaches the **"Approve-Promote-StagingDistribution"** step, it will pause. This is your chance to verify the new version.

The new version is deployed to a Staging environment that is accessible via your **Production URL** but hidden behind a header.

### Option 1: Using CLI (Recommended)
Run the following command in your terminal:
```bash
curl -H "aws-cf-cd-test: blue" https://your-domain.com
```
Check the output to see if your new changes are present.

### Option 2: Using Browser
1.  Install a browser extension like **ModHeader**.
2.  Add a Request Header:
    *   **Name**: `aws-cf-cd-test`
    *   **Value**: `blue`
3.  Visit your website. You should see the new version.
4.  Disable the header to see the old version (what regular users see).

## ✅ Promotion

If the testing looks good:
1.  Go to the **AWS CodePipeline** console.
2.  Find the **"Approve-Promote-StagingDistribution"** step.
3.  Click **Review** -> **Approve**.

The Step Function will execute and instantly promote the Staging configuration to Production.

## ⚠️ Troubleshooting

**Issue: I see the new version without the header!**
*   This happens if the Primary Distribution is pointing to the Staging Bucket (Configuration Drift).
*   **Fix**:
    1.  Set `ENABLE_CONTINUOUS_DEPLOYMENT: false` in `pipeline-input-variables.ts`.
    2.  Push and let the pipeline run (this resets Production).
    3.  Set `ENABLE_CONTINUOUS_DEPLOYMENT: true` and push again.

**Issue: Changes aren't showing up even with the header.**
*   Ensure the pipeline has finished the "Staging" deployment stage.
*   Try using `curl` to bypass browser caching.
*   Check CloudFront Invalidations in the AWS Console to ensure they completed.
