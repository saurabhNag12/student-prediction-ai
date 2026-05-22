# Viva Questions and Answers

### Q1: What is the objective of this project?
**A:** To predict student academic performance using machine learning, helping educators identify students who need support (SDG 4).

### Q2: Why did you choose Random Forest Classifier?
**A:** Random Forest is an ensemble learning method that is robust to noise and less prone to overfitting compared to single decision trees, making it ideal for categorical prediction like "Excellent" vs "Average".

### Q3: What is the role of AWS Lambda in this architecture?
**A:** Lambda acts as a serverless bridge. It receives JSON data from API Gateway, formats it for the SageMaker endpoint, and handles the response logic.

### Q4: How does API Gateway communicate with the frontend?
**A:** The frontend sends an HTTP POST request to the API Gateway endpoint. API Gateway triggers the Lambda function and returns the JSON result back to the frontend.

### Q5: What is Amazon SageMaker?
**A:** It is a fully managed service that provides everything needed to build, train, and deploy machine learning models at scale.

### Q6: How are you implementing SDG 4?
**A:** By identifying students requiring help through predictive analytics, we support "Quality Education" by promoting inclusive and equitable academic success.
