# 🌍 Climatopia - Project Architecture

## 🏗️ Complete System Architecture

```mermaid
graph TB
    %% User Interface Layer
    subgraph "👥 User Interface"
        USER[User]
        MOBILE[Mobile Browser]
        DESKTOP[Desktop Browser]
    end

    %% Frontend Layer
    subgraph "🖥️ Frontend (Next.js 14)"
        NEXTJS[Next.js App Router]
        HERO[Hero Section]
        FEATURES[Features Page]
        PRICING[Pricing Page]
        WHATIF[What If Page]
        SOCIAL[Social Feed]
        PROFILE[User Profile]
        WEATHER[Weather Dashboard]
    end

    %% Authentication & User Management
    subgraph "🔐 Authentication"
        CLERK[Clerk Auth]
        USERMGMT[User Management]
        CREDITS[Credit System]
    end

    %% Backend API Layer
    subgraph "⚙️ Backend APIs (Next.js API Routes)"
        USERAPI[User API]
        POSTAPI[Posts API]
        CREDITSAPI[Credits API]
        STATSAPI[Stats API]
        PAYMENTAPI[Payment API]
    end

    %% Database Layer
    subgraph "🗄️ Database"
        MONGODB[(MongoDB Atlas)]
        USERMODEL[User Model]
        POSTMODEL[Post Model]
        CREDITMODEL[Credit Model]
    end

    %% Python ML Backend
    subgraph "🤖 Python ML Backend (FastAPI)"
        FASTAPI[FastAPI Server]
        ECOAPI[Economic Impact API]
        CROPAPI[Crop Prediction API]
        ELECTRICAPI[Electricity Prediction API]
        ADAPTAPI[Adaptation Prediction API]
        TEMPAPI[Temperature Prediction API]
        HUMIDAPI[Humidity Prediction API]
    end

    %% ML Models & Data
    subgraph "📊 ML Models & Datasets"
        XGBOOST[XGBoost Models]
        LSTM[LSTM Models]
        DATASETS[Climate Datasets]
        WEATHER_DATA[Real-time Weather Data]
    end

    %% External Services
    subgraph "🌐 External Services"
        STRIPE[Stripe Payments]
        WEATHER_API[Weather APIs]
        NASA[NASA Climate Data]
        NOAA[NOAA Data]
        CLOUDINARY[Cloudinary Storage]
    end

    %% Web3 Layer (Optional)
    subgraph "⛓️ Web3 Features"
        BADGES[NFT Badges]
        WALLET[Wallet Integration]
        SMART_CONTRACT[Smart Contracts]
        IPFS[IPFS Metadata]
    end

    %% Social Features
    subgraph "👥 Social Features"
        FEED[Community Feed]
        LIKES[Like System]
        COMMENTS[Comments]
        ACHIEVEMENTS[Achievement System]
    end

    %% User Interactions
    USER --> MOBILE
    USER --> DESKTOP
    MOBILE --> NEXTJS
    DESKTOP --> NEXTJS

    %% Frontend Navigation
    NEXTJS --> HERO
    NEXTJS --> FEATURES
    NEXTJS --> PRICING
    NEXTJS --> WHATIF
    NEXTJS --> SOCIAL
    NEXTJS --> PROFILE
    NEXTJS --> WEATHER

    %% Authentication Flow
    NEXTJS --> CLERK
    CLERK --> USERMGMT
    USERMGMT --> CREDITS

    %% API Connections
    NEXTJS --> USERAPI
    NEXTJS --> POSTAPI
    NEXTJS --> CREDITSAPI
    NEXTJS --> STATSAPI
    NEXTJS --> PAYMENTAPI

    %% Database Connections
    USERAPI --> MONGODB
    POSTAPI --> MONGODB
    CREDITSAPI --> MONGODB
    STATSAPI --> MONGODB
    MONGODB --> USERMODEL
    MONGODB --> POSTMODEL
    MONGODB --> CREDITMODEL

    %% ML Backend Connections
    WHATIF --> FASTAPI
    FASTAPI --> ECOAPI
    FASTAPI --> CROPAPI
    FASTAPI --> ELECTRICAPI
    FASTAPI --> ADAPTAPI
    FASTAPI --> TEMPAPI
    FASTAPI --> HUMIDAPI

    %% ML Models
    ECOAPI --> XGBOOST
    CROPAPI --> XGBOOST
    ELECTRICAPI --> XGBOOST
    TEMPAPI --> LSTM
    HUMIDAPI --> XGBOOST
    ADAPTAPI --> DATASETS

    %% External Services
    PAYMENTAPI --> STRIPE
    WEATHER --> WEATHER_API
    FASTAPI --> NASA
    FASTAPI --> NOAA
    NEXTJS --> CLOUDINARY

    %% Web3 Integration
    ACHIEVEMENTS --> BADGES
    BADGES --> WALLET
    BADGES --> SMART_CONTRACT
    SMART_CONTRACT --> IPFS

    %% Social Features
    SOCIAL --> FEED
    FEED --> LIKES
    FEED --> COMMENTS
    LIKES --> ACHIEVEMENTS

    %% Styling
    classDef frontend fill:#e1f5fe
    classDef backend fill:#e8f5e8
    classDef database fill:#fff3e0
    classDef ml fill:#f3e5f5
    classDef external fill:#fce4ec
    classDef web3 fill:#e0f2f1

    class NEXTJS,HERO,FEATURES,PRICING,WHATIF,SOCIAL,PROFILE,WEATHER frontend
    class USERAPI,POSTAPI,CREDITSAPI,STATSAPI,PAYMENTAPI,CLERK,USERMGMT,CREDITS backend
    class MONGODB,USERMODEL,POSTMODEL,CREDITMODEL database
    class FASTAPI,ECOAPI,CROPAPI,ELECTRICAPI,ADAPTAPI,TEMPAPI,HUMIDAPI,XGBOOST,LSTM,DATASETS ml
    class STRIPE,WEATHER_API,NASA,NOAA,CLOUDINARY external
    class BADGES,WALLET,SMART_CONTRACT,IPFS web3
```

## 🔄 Data Flow Architecture

```mermaid
sequenceDiagram
    participant U as User
    participant F as Frontend
    participant A as Auth
    participant B as Backend API
    participant M as ML Engine
    participant D as Database
    participant E as External APIs

    Note over U,E: User asks "What If" question

    U->>F: Submit climate question
    F->>A: Verify user authentication
    A->>F: Return user session
    F->>B: Check user credits
    B->>D: Query user credits
    D->>B: Return credit balance
    B->>F: Credit validation result
    
    alt User has sufficient credits
        F->>B: Deduct 10 credits
        B->>D: Update user credits
        F->>M: Send question to ML engine
        M->>E: Fetch climate data
        E->>M: Return weather/climate data
        M->>M: Process with AI models
        M->>F: Return prediction results
        F->>B: Save question & answer
        B->>D: Store in database
        F->>U: Display results
    else Insufficient credits
        F->>U: Show upgrade prompt
    end
```

## 📱 Feature Flow Diagram

```mermaid
graph LR
    subgraph "🌦️ Weather Features"
        A[Real-time Weather] --> A1[City Search]
        A1 --> A2[Weather Display]
        A2 --> A3[Weather Charts]
    end

    subgraph "🤖 AI Predictions"
        B[What If Questions] --> B1[Natural Language Processing]
        B1 --> B2[ML Model Selection]
        B2 --> B3[Prediction Generation]
        B3 --> B4[Result Visualization]
    end

    subgraph "👥 Social Features"
        C[Community Feed] --> C1[Post Questions]
        C1 --> C2[Like & Comment]
        C2 --> C3[Achievement Badges]
        C3 --> C4[NFT Conversion]
    end

    subgraph "💳 Credit System"
        D[Credit Management] --> D1[Free Credits]
        D1 --> D2[Subscription Plans]
        D2 --> D3[Payment Processing]
        D3 --> D4[Credit Top-up]
    end

    %% Connections between features
    A --> B
    B --> C
    C --> D
```

## 🏗️ Technical Stack Overview

```mermaid
graph TB
    subgraph "Frontend Stack"
        NEXT[Next.js 14]
        REACT[React 18]
        TAILWIND[Tailwind CSS]
        FRAMER[Framer Motion]
        CLERK_UI[Clerk UI]
    end

    subgraph "Backend Stack"
        NEXTAPI[Next.js API Routes]
        MONGOOSE[Mongoose ODM]
        CLERK_BE[Clerk Backend]
        STRIPE_BE[Stripe SDK]
    end

    subgraph "ML Stack"
        FASTAPI_ML[FastAPI]
        PYTORCH[PyTorch]
        XGBOOST_ML[XGBoost]
        PANDAS[Pandas]
        PLOTLY[Plotly]
    end

    subgraph "Database & Storage"
        MONGO[MongoDB Atlas]
        CLOUD[Cloudinary]
    end

    subgraph "Deployment"
        VERCEL[Vercel]
        RAILWAY[Railway]
    end

    NEXT --> NEXTAPI
    NEXTAPI --> MONGO
    NEXT --> FASTAPI_ML
    FASTAPI_ML --> PYTORCH
    NEXTAPI --> CLOUD
    NEXT --> VERCEL
    FASTAPI_ML --> RAILWAY
```

## 📊 Credit System Flow

```mermaid
graph TD
    A[New User Registration] --> B[Receive 50 Free Credits]
    B --> C{Ask What If Question?}
    C -->|Yes| D[Deduct 10 Credits]
    D --> E{Credits >= 10?}
    E -->|Yes| F[Process Question with AI]
    E -->|No| G[Show Subscription Plans]
    G --> H[Choose Plan]
    H --> I[Stripe Payment]
    I --> J[Add Credits to Account]
    J --> C
    F --> K[Display Results]
    K --> C
```

## 🌍 Project Statistics

| Component | Technology | Purpose |
|-----------|------------|---------|
| **Frontend** | Next.js 14 + React | User interface and experience |
| **Backend** | Next.js API Routes | REST API and business logic |
| **Authentication** | Clerk | User management and security |
| **Database** | MongoDB Atlas | Data persistence |
| **ML Engine** | Python + FastAPI | AI predictions and analysis |
| **Payments** | Stripe | Subscription and credit management |
| **Deployment** | Vercel + Railway | Cloud hosting |
| **Storage** | Cloudinary | Media and file storage |
| **Web3** | Solidity + IPFS | NFT badges (optional) |

## 🔗 API Endpoints Overview

### Frontend APIs (Next.js)
- `/api/user/*` - User management
- `/api/posts/*` - Social features
- `/api/credits/*` - Credit system
- `/api/payments/*` - Subscription handling

### ML APIs (Python FastAPI)
- `/predict_economic_impact` - Economic predictions
- `/predict_croprate` - Agricultural forecasting
- `/predict_electricity` - Energy demand
- `/predict_adaptation` - Climate adaptation
- `/temperature_prediction` - Weather forecasting
- `/humidity_prediction` - Humidity analysis

---

**Built with ❤️ by Team T3Coders**  
*Climatopia - Simulating Earth's Future with AI*
