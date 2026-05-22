# AWS SageMaker Training Script (Scikit-Learn)
# This script is used by SageMaker for training and deployment

import argparse
import os
import pandas as pd
from sklearn.ensemble import RandomForestClassifier
import joblib

if __name__ == '__main__':
    parser = argparse.ArgumentParser()

    # SageMaker specific arguments
    parser.add_argument('--output-data-dir', type=str, default=os.environ.get('SM_OUTPUT_DATA_DIR'))
    parser.add_argument('--model-dir', type=str, default=os.environ.get('SM_MODEL_DIR'))
    parser.add_argument('--train', type=str, default=os.environ.get('SM_CHANNEL_TRAIN'))

    args = parser.parse_args()

    # Load dataset
    data = pd.read_csv(os.path.join(args.train, 'dataset_sample.csv'))

    # Features and Target
    X = data[['attendance', 'study_hours', 'assignment_score', 'internal_marks', 'previous_sem_score']]
    y = data['performance']

    # Train Random Forest Classifier
    model = RandomForestClassifier(n_estimators=100, random_state=42)
    model.fit(X, y)

    # Save the model
    joblib.dump(model, os.path.join(args.model_dir, 'model.joblib'))

def model_fn(model_dir):
    """Load model from model_dir"""
    model = joblib.load(os.path.join(model_dir, 'model.joblib'))
    return model

def input_fn(request_body, request_content_type):
    """Parse input data"""
    if request_content_type == 'text/csv':
        # Parse CSV input
        # Note: SageMaker sends CSV data as string
        import io
        df = pd.read_csv(io.StringIO(request_body), header=None)
        return df
    else:
        raise ValueError("Unsupported content type: " + request_content_type)

def predict_fn(input_data, model):
    """Make prediction"""
    prediction = model.predict(input_data)
    return prediction
