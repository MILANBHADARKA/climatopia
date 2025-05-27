from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware




app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # or specify your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.post("/predict_adaptation")
def predict_adaptation(scenario: str):
    try:
        from classify import classify_adaptation  
        result = classify_adaptation(scenario)
        return {"success": True, "predicted_adaptation_strategy": result}
    except Exception as e:
        return {"success": False, "error": str(e)}
    

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)