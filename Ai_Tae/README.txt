Project Link:
https://shivanidhakate.github.io/Disease_Predictor/

Bayesian Network for Disease Prediction
This project demonstrates how the IT and Healthcare industries use Bayesian Belief Networks to calculate the probability of a disease given various risk factors and symptoms.

📌 Project Overview
Problem: Disease probability estimation under uncertainty.
AI Technique: Bayesian Networks (Exact Inference via Variable Elimination).
Representation: Directed Acyclic Graph (DAG).
Tools Used: Python, pgmpy.
Outcome: A probabilistic decision engine that dynamically updates probabilities instead of rigid "Yes/No" classifications.
🧬 Network Architecture (DAG)
The system models Lung Cancer prediction using 5 Nodes:

Pollution (Environmental Risk Factor: Low / High)
Smoker (Lifestyle Risk Factor: No / Yes)
Cancer (Disease: No / Yes) - caused by Pollution and Smoking
XRay (Test Result: Negative / Positive) - caused by Cancer
Dyspnea (Symptom: Shortness of breath: No / Yes) - caused by Cancer

Description:
This project is a Disease Predictor web application that helps users identify possible diseases based on symptoms provided as input. It uses basic machine learning concepts and user-friendly design to provide predictions.

Features:

* User-friendly interface
* Input symptoms to get predictions
* Fast and simple output
* Web-based application (no installation required)

Technologies Used:

* HTML
* CSS
* JavaScript
* Python (for model training)

Purpose:
The main aim of this project is to demonstrate how machine learning can be used in healthcare to assist in early disease prediction.

Author:
Shivani Dhakate

Usage:

1. Open the project link
2. Enter symptoms
3. Get predicted disease result

Note:
This project is for educational purposes only and should not be used as a substitute for professional medical advice.
