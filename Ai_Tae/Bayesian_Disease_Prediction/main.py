from pgmpy.models import DiscreteBayesianNetwork
from pgmpy.factors.discrete import TabularCPD
from pgmpy.inference import VariableElimination

def create_disease_model():
    """
    Constructs a Bayesian Belief Network representing a Clinical Decision Support System.
    """
    # 1. Define the network structure (DAG - Directed Acyclic Graph)
    # Edges define causality (Parent -> Child)
    model = DiscreteBayesianNetwork([
        ('Pollution', 'Cancer'),
        ('Smoker', 'Cancer'),
        ('Cancer', 'XRay'),
        ('Cancer', 'Dyspnea')
    ])

    # 2. Define Conditional Probability Distributions (CPDs)
    
    # Variable: Pollution (0: Low, 1: High)
    cpd_pollution = TabularCPD(variable='Pollution', variable_card=2, values=[[0.9], [0.1]])

    # Variable: Smoker (0: No, 1: Yes)
    cpd_smoker = TabularCPD(variable='Smoker', variable_card=2, values=[[0.7], [0.3]])

    # Variable: Cancer (0: No, 1: Yes)
    # Depends on: Pollution, Smoker
    # Columns map to: [Pol=0, Smk=0], [Pol=0, Smk=1], [Pol=1, Smk=0], [Pol=1, Smk=1]
    cpd_cancer = TabularCPD(
        variable='Cancer', variable_card=2,
        values=[
            [0.999, 0.90, 0.95, 0.80],  # Probabilities of NO Cancer
            [0.001, 0.10, 0.05, 0.20]   # Probabilities of YES Cancer
        ],
        evidence=['Pollution', 'Smoker'],
        evidence_card=[2, 2]
    )

    # Variable: XRay (0: Negative, 1: Positive)
    # Depends on: Cancer
    # Columns map to: [Cancer=0], [Cancer=1]
    cpd_xray = TabularCPD(
        variable='XRay', variable_card=2,
        values=[
            [0.90, 0.20],  # Negative XRay
            [0.10, 0.80]   # Positive XRay
        ],
        evidence=['Cancer'], evidence_card=[2]
    )

    # Variable: Dyspnea (Shortness of breath) (0: No, 1: Yes)
    # Depends on: Cancer
    # Columns map to: [Cancer=0], [Cancer=1]
    cpd_dyspnea = TabularCPD(
        variable='Dyspnea', variable_card=2,
        values=[
            [0.65, 0.30],  # No Dyspnea
            [0.35, 0.70]   # Yes Dyspnea
        ],
        evidence=['Cancer'], evidence_card=[2]
    )

    # 3. Add all CPDs to the model
    model.add_cpds(cpd_pollution, cpd_smoker, cpd_cancer, cpd_xray, cpd_dyspnea)

    # 4. Validate the model (Ensure DAG structure is valid and probabilities sum to 1)
    assert model.check_model(), "Error: Model structure or probabilities are invalid!"
    return model

def print_separator():
    print("\n" + "="*60 + "\n")

def main():
    print("🏥 Initializing Medical Bayesian Network...")
    model = create_disease_model()
    
    print("✅ Model created and validated successfully!")
    print("Nodes:", model.nodes())
    print("Edges:", model.edges())
    print_separator()

    # Initialize the Exact Inference Engine
    inference = VariableElimination(model)

    # --- Scenario 1 ---
    print("🩺 SCENARIO 1: Baseline Risk (No evidence collected yet)")
    print("Query: What is the baseline probability of having Lung Cancer?")
    res1 = inference.query(variables=['Cancer'])
    print(res1)
    print_separator()

    # --- Scenario 2 ---
    print("😷 SCENARIO 2: High-Risk Profile")
    print("Evidence: Patient is a Smoker (1) and lives in a High Pollution area (1)")
    print("Query: Probability of Lung Cancer given these risk factors?")
    res2 = inference.query(variables=['Cancer'], evidence={'Smoker': 1, 'Pollution': 1})
    print(res2)
    print_separator()

    # --- Scenario 3 ---
    print("🤒 SCENARIO 3: Symptom Observed, No tests yet")
    print("Evidence: Patient has Dyspnea/Shortness of breath (1)")
    print("Query: Probability of Lung Cancer?")
    res3 = inference.query(variables=['Cancer'], evidence={'Dyspnea': 1})
    print(res3)
    print_separator()

    # --- Scenario 4 ---
    print("🔍 SCENARIO 4: Backward Diagnostic Reasoning (XAI Factor)")
    print("Evidence: Patient X-Ray came back Positive (1)")
    print("Query: What is the probability that this person is a Smoker based on this result?")
    res4 = inference.query(variables=['Smoker'], evidence={'XRay': 1})
    print(res4)
    print_separator()

if __name__ == "__main__":
    main()
