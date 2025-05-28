# 🌍 Climatopia

> An AI-powered, planet-scale simulation engine for "what if" scenarios across climate, economy, and humanity.

## 📋 Table of Contents

- [Project Overview](#project-overview)
- [Problem Statement](#problem-statement)
- [Our Solution](#our-solution)
- [Architecture](#architecture)
- [API Documentation](#api-documentation)
- [Installation Guide](#installation-guide)
- [Python Packages](#python-packages)
- [Project Members](#project-members)
- [License](#license)

## 🚀 Project Overview

Climatopia is a comprehensive platform that leverages advanced machine learning techniques, multi-agent reinforcement learning, and graph neural networks to simulate complex "what if" scenarios across climate, economy, and social systems. Our platform enables researchers, policymakers, businesses, and concerned citizens to explore the potential impacts of various interventions and policy decisions on our planet's future.

The project combines cutting-edge AI technologies with real-world datasets from NASA, NOAA, IMF, World Bank, and other authoritative sources to create accurate, data-driven simulations that can help inform critical decisions about our collective future.

## 🔍 Problem Statement

Our world faces unprecedented challenges:

- **Climate Crisis**: Rising temperatures, extreme weather events, and ecological disruption threaten global stability.
- **Economic Uncertainty**: Traditional economic models struggle to account for climate impacts and resource constraints.
- **Policy Complexity**: Decision-makers lack tools to understand the complex, interconnected consequences of their choices.
- **Data Silos**: Critical information exists in disconnected systems, making holistic analysis difficult.
- **Public Understanding**: Complex scientific models are often inaccessible to the general public.

## 💡 Our Solution

Climatopia addresses these challenges through:

1. **Integrated Modeling**: Combining climate science, economics, and social dynamics in a unified simulation framework.
2. **AI-Powered Predictions**: Using advanced machine learning to model complex system interactions and emergent behaviors.
3. **Accessible Interface**: Providing intuitive visualizations and plain-language explanations of complex scenarios.
4. **Community Engagement**: Enabling users to share, discuss, and collaborate on simulation scenarios.
5. **Real-World Data**: Incorporating authoritative datasets to ground simulations in empirical reality.

## 🏗️ Architecture

Climatopia is built as a scalable monorepo with the following components:

```
Climatopia/ 
├── website/                     # Frontend (Next.js App)
│   ├── public/
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   ├── data/
│   │   ├── models/
│   │   ├── types/
│   │   ├── util/
│   │   └── middleware.js
│   ├── .env
│   ├── package.json
│   └── README.md                ✅ README for frontend

├── web3/                        # Smart Contract & Badge Logic
│   ├── badges/                 # JSON badge metadata
│   ├── contract.sol            # Solidity smart contract
│   ├── index.js                # JavaScript interface
│   └── README.md               ✅ README for web3 logic

├── Python Backend/                 # Python ML Backend 
│   ├── Datasets/
│   ├── eco_xbg/
│   ├── electricity_prediction/
│   ├── fastapis/
│   ├── pretrained_models/      ✅ Optional: Move pretrained files here
│   ├── .env
│   ├── *.py
│   ├── *.json
│   └── README.md               ✅ README for backend

├── README.md                   ✅ Main project overview
└── LICENSE
└── CODE_OF_CONDUCT.md
└── CONTRIBUTING.md
└── SECURITY.md
```

### Core Modules:

1. **Simulation Engine (Python)**
   - Multi-Agent Reinforcement Learning with Ray RLlib/PettingZoo
   - Graph Neural Networks for modeling interdependencies using PyTorch Geometric/DGL
   - Physics-Informed Neural Networks for accurate physical modeling
   - FastAPI server for exposing simulation capabilities

2. **Backend API (Next.js/Express)**
   - Scenario configuration and management
   - User profiles, social features
   - Credit system and Web3 integration
   - Notification system

3. **Frontend Interface (Next.js)**
   - Interactive map-based visualizations
   - Scenario creation and management
   - Community features
   - Subscription management

4. **GenAI Module**
   - LLM-powered explanations of simulation results
   - Chain-of-thought reasoning for transparent analysis
   - Natural language processing for scenario creation

5. **Subscription & Credit System**
   - Tiered access model (Free/Pro/NGO)
   - Usage tracking and analytics
   - Payment processing

6. **Social Sharing System**
   - Community features for sharing simulation results
   - Discussion and collaboration tools
   - Leaderboards and trending scenarios

7. **Web3 Rewards**
   - Achievement badges as NFTs
   - Contributor recognition
   - Verification system for organizations


### **Access the application**

Open your browser and navigate to `http://localhost:3000`

### Deployment

The project is set up for deployment on Vercel (frontend/backend) and Railway (Python APIs).

\`\`\`bash
# Deploy frontend and backend
npm run deploy

# Deploy ML engine
cd packages/ml-core
railway up
\`\`\`

## 📦 Python Packages

The ML engine relies on the following key Python packages:

- **FastAPI**: Web framework for API development
- **PyTorch**: Deep learning framework
- **PyTorch Geometric**: Graph neural network library
- **Ray RLlib**: Distributed reinforcement learning
- **PettingZoo**: Multi-agent reinforcement learning environments
- **SciANN**: Scientific computing with neural networks
- **NumPy/Pandas**: Data manipulation and analysis
- **Matplotlib/Plotly**: Data visualization
- **LangChain**: LLM integration framework
- **scikit-learn**: Machine learning utilities
- **xgboost/lightgbm**: Gradient boosting frameworks
- **NetworkX**: Graph analysis
- **Geopandas**: Geospatial data handling
- **Dask**: Parallel computing

Full requirements can be found in `packages/ml-core/requirements.txt`

## 👥 Project Members

| Name | Role | Contact |
|------|------|---------|
| [Team Member 1] | Project Lead | [email/github] |
| [Team Member 2] | ML Engineer | [email/github] |
| [Team Member 3] | Frontend Developer | [email/github] |
| [Team Member 4] | Backend Developer | [email/github] |
| [Team Member 5] | Data Scientist | [email/github] |
| [Team Member 6] | DevOps Engineer | [email/github] |

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

<p align="center">© 2025 Climatopia Team. All rights reserved.</p>
\`\`\`

<CodeProject id="earthsim_project">
