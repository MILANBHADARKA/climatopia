from langchain_groq import ChatGroq
from langchain_core.messages import SystemMessage, HumanMessage
import os
from dotenv import load_dotenv

# === Load environment variables ===
load_dotenv()

# === Map LLAMA_API_KEY to GROQ_API_KEY for Groq compatibility ===
os.environ["GROQ_API_KEY"] = os.getenv("LLAMA_API_KEY")

# === Initialize LLaMA 3 model via Groq ===
llm = ChatGroq(
    model_name="llama3-70b-8192",  # or "llama3-8b-8192"
    api_key=os.environ["GROQ_API_KEY"]
)


# === Geopolitical Analyst Agent ===
def explain_geopolitical_what_if(question: str):
    system_prompt = (
        "You are a geopolitical analyst. When given a 'What if...' scenario, "
        "analyze the global political, economic, and social consequences in depth. "
        "Cover effects on international relations, governments, conflicts, migration, economies, "
        "alliances, and global power structures. Use speculative reasoning based on historical and modern geopolitics. "
        "Make the answer insightful and accessible to general readers."
    )

    messages = [
        SystemMessage(content=system_prompt),
        HumanMessage(content=question)
    ]

    response = llm.invoke(messages)
    return response.content

# === Main execution for testing ===
if __name__ == "__main__":
    question = "What if half the Earth turns into a giant desert?"

    # Geopolitical answer
    geopolitical_answer = explain_geopolitical_what_if(question)
    print(f"\n🧭 Geopolitical Question: {question}\n")
    print(f"🌐 Geopolitical Impact:\n{geopolitical_answer}")
