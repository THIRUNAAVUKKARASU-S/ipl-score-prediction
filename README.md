# IPL Score Prediction Using Machine Learning

A modern, responsive, and production-ready full-stack web application that predicts the final IPL innings score based on live match variables. This project leverages a custom Deep Learning Sequential Neural Network trained using **TensorFlow/Keras** and exposes a lightweight, robust **Flask** API consumed by a sleek glassmorphic **React** frontend.

## 👤 Developer
**Thirunaavukkarasu S**

---

## 🎯 Project Objective
Develop a predictive analytics model and interactive interface that forecasts the final first-innings score of an IPL match. The model uses real-time metrics—including current runs, wickets, overs, striker's score, active batsman strength, bowler strength, and the venue—to generate an accurate prediction, categorized as **Low**, **Competitive**, or **High** scoring.

---

## 🛠️ Technology Stack

### Backend
* **Python**: Core scripting language (v3.10 suggested due to TensorFlow support).
* **Flask + Flask-CORS**: Lightweight backend REST API server.
* **TensorFlow / Keras**: Deep learning engine for training and model inference.
* **Scikit-Learn**: Normalization (MinMaxScaler) and categorical label encoding (LabelEncoder).
* **Pandas & NumPy**: Data manipulation and dataset aggregation.

### Frontend
* **React.js (Vite)**: Component-based UI framework running on Port `5175`.
* **Tailwind CSS**: Utility-first CSS styling for a modern, glassmorphic UI.
* **Framer Motion**: Smooth entry, exit, and hover animations.
* **Chart.js + React-Chartjs-2**: Interactive stats dashboards and training curve plotting.
* **Lucide React**: Clean SVG icons.

---

## 📊 Model Specifications & Training
- **Dataset**: Built from over 74,000 match state snapshots generated from historic cricket distributions.
- **Model Architecture**:
  - **Input Layer**: 9 Features (scaled using `MinMaxScaler` and label-encoded classes).
  - **Hidden Layer 1**: 512 Neurons, ReLU activation, Dropout (0.15)
  - **Hidden Layer 2**: 216 Neurons, ReLU activation, Dropout (0.15)
  - **Output Layer**: 1 Neuron, ReLU activation (predicts score).
- **Optimization**:
  - **Loss Function**: Huber Loss
  - **Optimizer**: Adam (learning_rate = 0.001)
  - **Evaluation Metric**: Mean Absolute Error (MAE)
- **Validation MAE**: **~8.06 runs** (meaning predictions deviate from final scores by an average of only 8 runs).

---

## 📂 Project Structure

```
├── backend/
│   ├── app.py             # Flask Web Server & API handlers
│   ├── generate_data.py   # Script simulating realistic IPL datasets
│   └── train_model.py     # TensorFlow/Keras model training pipeline
├── data/
│   └── ipl_data.csv       # Simulated match statistics dataset
├── frontend/
│   ├── src/
│   │   ├── components/    # Reusable UI pages & dashboards
│   │   ├── App.jsx        # Main application state/navigation
│   │   ├── main.jsx       # React entry point
│   │   └── index.css      # Core styles & Tailwind directives
│   ├── vite.config.js     # Dev server configuration (Port 5175)
│   └── package.json       # Frontend dependencies
├── models/
│   ├── ipl_model.keras    # Pre-trained Sequential Neural Network
│   ├── scaler.pkl         # Trained MinMaxScaler preprocessing asset
│   ├── *_encoder.pkl      # Categorical LabelEncoders for Venue, Teams, Players
│   └── metrics.json       # Training loss and MAE metrics history
└── README.md              # Documentation (This file)
```

---

## 🚀 Getting Started

### Prerequisites
- Python 3.10 installed on your system (TensorFlow v2.19.0 / Keras v3.10.0 compatible).
- Node.js (v18+) and npm.

### Setup and Running the Backend
1. Open a terminal, navigate to the project root directory, and run:
   ```bash
   py -3.10 backend/app.py
   ```
2. The server will start on: `http://127.0.0.1:5000/`. It automatically loads the model, scaler, encoders, and computes the dashboard statistics.

### Setup and Running the Frontend
1. Open a separate terminal, navigate to the `frontend/` directory:
   ```bash
   cd frontend
   ```
2. Install frontend dependencies:
   ```bash
   npm install
   ```
3. Run the development server:
   ```bash
   npm run dev
   ```
4. Access the web interface at: `http://localhost:5175/`.

---

## 🧪 Model Testing & Verifications
- **Prediction Input Validation**: Collisions (e.g. batting team vs bowling team matches) are flagged. Overs input accepts standard format (e.g. `10.5` is valid, `10.6` is blocked).
- **Responsive Layout**: Designed to adjust between mobile, tablet, and widescreen desktops.
- **Theme Support**: Toggles seamlessly between dark premium analytics theme and a clean light layout.
