from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
import os

import os
from dotenv import load_dotenv

# Load .env file
load_dotenv()

# Map LLAMA_API_KEY to what Groq expects
os.environ["GROQ_API_KEY"] = os.getenv("LLAMA_API_KEY")


# Initialize LLaMA 3 via Groq
llm = ChatGroq(
    model_name="llama3-70b-8192",  # or "llama3-8b-8192"
    api_key=os.environ["GROQ_API_KEY"]
)

def explain_planetary_what_if(question: str):
    system_prompt = (
        "You are a planetary science expert. When given a 'What if...' scenario, "
        "respond with a rich, detailed explanation grounded in planetary science, "
        "including the effects on Earth’s climate — such as the impact on seas, oceans, land, and atmosphere. "
        "Use astrophysics and scientific speculation. Make it understandable to curious readers."
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=question)
    ]

    response = llm.invoke(messages)
    return response.content

# Example
if __name__ == "__main__":
    question = "What if half the Earth turns into a giant desert?"
    answer = explain_planetary_what_if(question)

    print(f"🌀 Question: {question}\n")
    print(f"🌍 Answer:\n{answer}")
