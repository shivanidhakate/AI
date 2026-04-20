# Bayesian Network for Disease Prediction

This project demonstrates how the IT and Healthcare industries use **Bayesian Belief Networks** to calculate the probability of a disease given various risk factors and symptoms.

## 📌 Project Overview
* **Problem**: Disease probability estimation under uncertainty.
* **AI Technique**: Bayesian Networks (Exact Inference via Variable Elimination).
* **Representation**: Directed Acyclic Graph (DAG).
* **Tools Used**: Python, `pgmpy`.
* **Outcome**: A probabilistic decision engine that dynamically updates probabilities instead of rigid "Yes/No" classifications.

## 🧬 Network Architecture (DAG)
The system models **Lung Cancer** prediction using 5 Nodes:
1. **Pollution** (Environmental Risk Factor: Low / High)
2. **Smoker** (Lifestyle Risk Factor: No / Yes)
3. **Cancer** (Disease: No / Yes) - *caused by Pollution and Smoking*
4. **XRay** (Test Result: Negative / Positive) - *caused by Cancer*
5. **Dyspnea** (Symptom: Shortness of breath: No / Yes) - *caused by Cancer*

## 🚀 How to Run

### 1. Install Dependencies
Ensure you have Python installed, then install the required AI libraries:
```bash
pip install -r requirements.txt
```

### 2. Run the AI Model
Execute the main script to see the probability calculations under different medical scenarios:
```bash
python main.py
```
