import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
import os

load_dotenv()  # This loads variables from .env into environment

api_key = os.getenv("LLAMA_API_KEY")
# Initialize LLM
llm = ChatGroq(
    model_name="llama3-70b-8192",  # You can also try "llama3-8b-8192"
    api_key=api_key
)

# Define prompt template
prompt_template = PromptTemplate.from_template("""
You are an expert in climate science and sustainable agriculture.

Your task is to analyze the following hypothetical scenario and estimate its impact on key environmental, agricultural, and economic indicators in **India**.

---
### Scenario:
"{scenario}"
---

### Instructions:
- Return ONLY a **valid JSON object** with numeric values for each field.
- Do **not** include any explanation, markdown formatting (no ```), or text outside the JSON.
- All values must be strictly **positive floats**, **except** for `meantemp`, which can be negative.
- Ensure:
  - `humidity` is between **60-100**
  - `wind_speed` is between **0-8**
  - `meanpressure` is between **1005-1020**
  - `Soil_Health_Index` is between **0-100**

---
### Output Format Example:
{{
  "meantemp": -1.5,
  "humidity": 82.3,
  "wind_speed": 4.1,
  "meanpressure": 1012.7,
  "Economic_Impact_Million_USD": 145.0,
  "Total_Precipitation_mm": 210.3,
  "CO2_Emissions_MT": 3.4,
  "Crop_Yield_MT_per_HA": 2.5,
  "Pesticide_Use_KG_per_HA": 1.8,
  "Fertilizer_Use_KG_per_HA": 4.7,
  "Soil_Health_Index": 76.2,
  "solar_generation": 1250.4,
  "Temperature": 34.8
}}
---
Respond only with a JSON object exactly like the format above.
""")

# Function to run the climate impact estimator
def run_climate_scenario_prediction(scenario: str):
    chain = prompt_template | llm | StrOutputParser()
    result = chain.invoke({"scenario": scenario})

    try:
        result_cleaned = result.strip().strip("```json").strip("```").strip()
        parsed_json = json.loads(result_cleaned)
        return parsed_json
    except Exception as e:
        return f"Error parsing JSON: {e}\nRaw result:\n{result}"

# Example usage
scenario = "What if all the energy generated on earth is thoruh nuclear power plant?"
prediction = run_climate_scenario_prediction(scenario)
# generateImage(scenario)

# print("🌍 LLM Climate Impact Prediction:")
# print(json.dumps(prediction, indent=2) if isinstance(prediction, dict) else prediction)
