import os
import json
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Dense, Dropout, Input
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import LabelEncoder, MinMaxScaler
import joblib

# Set random seed
np.random.seed(42)
tf.random.set_seed(42)

def train_ipl_model():
    print("Loading data...")
    df = pd.read_csv('data/ipl_data.csv')
    
    # Feature columns
    feature_cols = ['venue', 'bat_team', 'bowl_team', 'runs', 'wickets', 'overs', 'striker', 'batsman', 'bowler']
    target_col = 'final_score'
    
    X = df[feature_cols].copy()
    y = df[target_col].values
    
    # Create models directory
    os.makedirs('models', exist_ok=True)
    
    # Label encoding for categoricals
    categorical_cols = ['venue', 'bat_team', 'bowl_team', 'batsman', 'bowler']
    encoders = {}
    
    for col in categorical_cols:
        le = LabelEncoder()
        # Add an "unknown" class to label encoder classes to handle unseen inputs
        unique_vals = list(X[col].unique())
        if 'Unknown' not in unique_vals:
            unique_vals.append('Unknown')
        le.fit(unique_vals)
        X[col] = le.transform(X[col])
        encoders[col] = le
        # Save encoder
        joblib.dump(le, f'models/{col}_encoder.pkl')
        print(f"Encoded {col} with {len(le.classes_)} classes.")
        
    # Scale features using MinMaxScaler
    scaler = MinMaxScaler()
    X_scaled = scaler.fit_transform(X)
    joblib.dump(scaler, 'models/scaler.pkl')
    print("Features scaled using MinMaxScaler.")
    
    # Split data
    X_train, X_val, y_train, y_val = train_test_split(X_scaled, y, test_size=0.2, random_state=42)
    
    # Define TensorFlow Keras model
    # Architecture: Input -> Dense(512, ReLU) -> Dense(216, ReLU) -> Output(1, ReLU)
    model = Sequential([
        Input(shape=(X_train.shape[1],)),
        Dense(512, activation='relu'),
        Dropout(0.15),
        Dense(216, activation='relu'),
        Dropout(0.15),
        Dense(1, activation='relu') # Score is always positive, ReLU is ideal
    ])
    
    # Optimizer: Adam, Loss: Huber Loss, Metric: MAE
    model.compile(
        optimizer=tf.keras.optimizers.Adam(learning_rate=0.001),
        loss=tf.keras.losses.Huber(),
        metrics=['mae']
    )
    
    print("Training neural network...")
    # Train the model
    history = model.fit(
        X_train, y_train,
        validation_data=(X_val, y_val),
        epochs=15,
        batch_size=128,
        verbose=1
    )
    
    # Save the model in Keras format
    model.save('models/ipl_model.keras')
    print("Model saved to 'models/ipl_model.keras'.")
    
    # Evaluate model
    val_loss, val_mae = model.evaluate(X_val, y_val, verbose=0)
    print(f"Validation MAE: {val_mae:.4f}")
    
    # Save training metrics history for plotting
    history_dict = history.history
    # Convert float32 lists to standard float for JSON serialization
    metrics_data = {
        'mae': [float(x) for x in history_dict['mae']],
        'val_mae': [float(x) for x in history_dict['val_mae']],
        'loss': [float(x) for x in history_dict['loss']],
        'val_loss': [float(x) for x in history_dict['val_loss']],
        'final_mae': float(val_mae)
    }
    
    with open('models/metrics.json', 'w') as f:
        json.dump(metrics_data, f, indent=4)
    print("Metrics and history saved to 'models/metrics.json'.")

if __name__ == '__main__':
    train_ipl_model()
