import os
import json
from langchain_groq import ChatGroq
from langchain_core.prompts import PromptTemplate
from langchain_core.output_parsers import StrOutputParser

from dotenv import load_dotenv
import os

load_dotenv()  # This loads variables from .env into environment

api_key = os.getenv("LLAMA_API_KEY")


# Set your API key
os.environ["GROQ_API_KEY"] = api_key

# Initialize LLM
llm = ChatGroq(
    model_name="llama3-70b-8192",  # You can also try "llama3-8b-8192"
    api_key=os.environ["GROQ_API_KEY"]
)

# Define prompt template
prompt_template = PromptTemplate.from_template("""
You are an expert in climate science and sustainable agriculture. Given a hypothetical scenario, your task is to estimate the effects on various environmental, agricultural, and economic indicators in India.

Scenario: {scenario}



Estimate the impact on the following indicators:
- meantemp (°C)
- humidity (%)
- wind_speed (km/h)
- meanpressure (hPa)
- Economic_Impact_Million_USD
- Total_Precipitation_mm
- CO2_Emissions_MT
- Crop_Yield_MT_per_HA
- Pesticide_Use_KG_per_HA
- Fertilizer_Use_KG_per_HA
- Soil_Health_Index (0-100)
-solar power generated (MWH)

only "meantemp" can be negative. every other thing should be positive.

Output format:
```json
{{
  "meantemp": float,
  "humidity": float, (between 60-100)
  "wind_speed": float, (between 0-8)
  "meanpressure": float, (between 1005-1020)
  "Economic_Impact_Million_USD": float,
  "Total_Precipitation_mm": float,
  "CO2_Emissions_MT": float,
  "Crop_Yield_MT_per_HA": float,
  "Pesticide_Use_KG_per_HA": float,
  "Fertilizer_Use_KG_per_HA": float,
  "Soil_Health_Index": float
  "solar power generated": float
}}
Only return valid JSON. No explanation.
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
scenario = "What if half the earth becomes ice??"
prediction = run_climate_scenario_prediction(scenario)

print("🌍 LLM Climate Impact Prediction:")
print(json.dumps(prediction, indent=2) if isinstance(prediction, dict) else prediction)
