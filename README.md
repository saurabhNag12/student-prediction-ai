# Student Performance AI using AWS SageMaker

This project builds a machine learning web application that predicts student academic performance using attendance, study hours, internal marks, assignment scores, and previous semester marks.

## 🚀 Architecture Overview
**User → Amplify Frontend → API Gateway → Lambda → SageMaker Endpoint → S3**

1.  **Frontend (AWS Amplify)**: A modern React dashboard where users input student data.
2.  **API Gateway**: Acts as the entry point for the REST API (`POST /predict`).
3.  **AWS Lambda**: A serverless function that transforms the incoming JSON payload into CSV format and invokes the SageMaker endpoint.
4.  **Amazon SageMaker**: Hosts a trained Random Forest model that predicts the student category.
5.  **Amazon S3**: Stores the training data (`dataset_sample.csv`) and the trained model artifacts.

## 🛠️ Step-by-Step Deployment

### 1. Model Training (SageMaker)
- Create a Notebook Instance in SageMaker.
- Upload `dataset_sample.csv` and `aws_sagemaker_script.py`.
- Run a training job using the `SKLearn` estimator pointing to S3.
- Deploy the model to a real-time endpoint (e.g., `ml.t2.medium`).

### 2. Backend Setup (Lambda & API Gateway)
- Create a Lambda function (`Python 3.12`).
- Add `AmazonSageMakerFullAccess` to the Lambda execution role.
- Set `SAGEMAKER_ENDPOINT_NAME` in the Lambda environment variables.
- Create a REST API in API Gateway with a `POST /predict` method.
- Enable CORS and link it to the Lambda function.

### 3. Frontend Deployment (AWS Amplify)
- Connect your GitHub repository to AWS Amplify.
- Configure the environment variable `VITE_API_GATEWAY_URL`.
- Deploy the build.

## 📈 Advantages of SageMaker
- **Managed Infrastructure**: No need to manage servers for training or hosting.
- **Scalability**: Automatically scales endpoints based on traffic.
- **Built-in Algorithms**: Provides highly optimized ML algorithms.
- **One-Click Deployment**: Easily transition from training to a live API.

## 🔐 Security Best Practices
- **Least Privilege**: Grant IAM roles only necessary permissions (e.g., `sagemaker:InvokeEndpoint`).
- **CORS Configuration**: Restrict API Gateway origins to your Amplify domain.
- **Encryption**: Use KMS for encrypting data in S3 and SageMaker.

## 💰 Cloud Cost Optimization
- **Instance Types**: Use `ml.t2.medium` for low-traffic endpoints.
- **Auto-stop**: Shut down SageMaker Notebook instances when not in use.
- **Serverless**: Leverage Lambda's pay-per-execution model.

## 🌍 SDG 4 Implementation
Target 4.1: By 2030, ensure that all girls and boys complete free, equitable and quality primary and secondary education. This AI helps by predicting potential failures early, allowing teachers to provide targeted interventions.
