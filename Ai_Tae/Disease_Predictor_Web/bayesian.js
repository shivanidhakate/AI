/**
 * bayesian.js
 * Pure JavaScript Bayesian Inference Engine
 * Models: Lung Cancer, Flu, Diabetes, Heart Disease
 */

const BayesianEngine = (() => {

  // ── Priors P(Disease) ──────────────────────────────────────────────────────
  const priors = {
    lungCancer:    0.03,
    flu:           0.12,
    diabetes:         0.08,
    heartDisease:  0.05
  };

  /**
   * Likelihood tables  P(symptom=true | disease=true)
   * Built from clinical literature / representative CPTs.
   */
  const likelihoods = {
    // Risk factors & symptoms as keys
    smoker: {
      lungCancer: 0.85, flu: 0.10, diabetes: 0.12, heartDisease: 0.60
    },
    pollution: {
      lungCancer: 0.60, flu: 0.05, diabetes: 0.06, heartDisease: 0.30
    },
    fever: {
      lungCancer: 0.15, flu: 0.90, diabetes: 0.85, heartDisease: 0.05
    },
    cough: {
      lungCancer: 0.65, flu: 0.70, diabetes: 0.75, heartDisease: 0.10
    },
    dyspnea: {
      lungCancer: 0.70, flu: 0.30, diabetes: 0.65, heartDisease: 0.75
    },
    fatigue: {
      lungCancer: 0.60, flu: 0.80, diabetes: 0.80, heartDisease: 0.65
    },
    chestPain: {
      lungCancer: 0.45, flu: 0.10, diabetes: 0.20, heartDisease: 0.90
    },
    excessiveThirst: {
      lungCancer: 0.05, flu: 0.15, diabetes: 0.85, heartDisease: 0.02
    },
    frequentUrination: {
      lungCancer: 0.05, flu: 0.10, diabetes: 0.80, heartDisease: 0.05
    },
    positiveXray: {
      lungCancer: 0.80, flu: 0.20, diabetes: 0.55, heartDisease: 0.30
    },
    highBP: {
      lungCancer: 0.10, flu: 0.05, diabetes: 0.60, heartDisease: 0.80
    },
    obesity: {
      lungCancer: 0.15, flu: 0.10, diabetes: 0.75, heartDisease: 0.70
    }
  };

  // P(symptom=true | disease=false) — false positive rate
  const falsePositiveRate = {
    smoker: 0.25, pollution: 0.15, fever: 0.05, cough: 0.10,
    dyspnea: 0.08, fatigue: 0.15, chestPain: 0.05, excessiveThirst: 0.10, frequentUrination: 0.10,
    positiveXray: 0.05, highBP: 0.20, obesity: 0.30
  };

  /**
   * Naive Bayes posterior:  P(D|E) ∝ P(D) * Π P(eᵢ|D)
   * @param {string[]} evidence - Array of active symptom/factor keys
   * @returns {{lungCancer, flu, diabetes, heartDisease}} probabilities 0–1
   */
  function query(evidence) {
    const diseases = Object.keys(priors);
    const scores = {};

    diseases.forEach(disease => {
      let score = priors[disease];
      evidence.forEach(sym => {
        if (likelihoods[sym]) {
          score *= likelihoods[sym][disease];
        }
      });
      // Also factor in non-observed symptoms (their complement)
      Object.keys(likelihoods).forEach(sym => {
        if (!evidence.includes(sym)) {
          const fp = falsePositiveRate[sym] || 0.10;
          const likelihood = likelihoods[sym][disease];
          // P(sym=false | disease) = 1 - P(sym=true | disease)
          score *= (1 - likelihood) / (1 - fp + 0.001);
        }
      });
      scores[disease] = score;
    });

    // Normalize so all probabilities sum to total (not forced to 1)
    const total = Object.values(scores).reduce((a, b) => a + b, 0);
    const normalized = {};
    diseases.forEach(d => {
      normalized[d] = total > 0 ? (scores[d] / total) * sumPriors() : priors[d];
    });
    return normalized;
  }

  function sumPriors() {
    return Object.values(priors).reduce((a, b) => a + b, 0);
  }

  /**
   * Simple version — returns probability normalized to [0,1] per disease independently.
   * Used for probability bar display.
   */
  function queryIndependent(evidence) {
    const diseases = Object.keys(priors);
    const result = {};

    diseases.forEach(disease => {
      let num = priors[disease];
      let denom_disease = priors[disease];
      let denom_no_disease = 1 - priors[disease];

      evidence.forEach(sym => {
        if (likelihoods[sym]) {
          num *= likelihoods[sym][disease];
          denom_disease *= likelihoods[sym][disease];
          denom_no_disease *= (falsePositiveRate[sym] || 0.10);
        }
      });

      const posterior = denom_disease / (denom_disease + denom_no_disease + 1e-9);
      result[disease] = Math.min(Math.max(posterior, 0), 1);
    });

    return result;
  }

  return { query, queryIndependent, likelihoods, priors };
})();
