# InterviewPro: Interview Preparation AI Platform

An intelligent interview preparation platform powered by Google GenAI that generates personalized interview strategies, technical questions, behavioral insights, and 7-day preparation roadmaps based on job descriptions and candidate profiles.

---

## 📋 Project Overview 

### **Situation**
Job seekers face challenges in preparing for interviews without guidance tailored to their specific skills, experience, and target roles. They need:
- Personalized interview questions based on job requirements
- Skill gap analysis to identify areas for improvement
- Structured preparation plans with actionable tasks
- Assessment of how well their profile matches the job

### **Task**
Build a full-stack web application that leverages AI to automate interview preparation by analyzing job descriptions, resumes, and candidate profiles to generate:
- Match score assessment
- Targeted technical and behavioral interview questions
- Skill gap identification with severity levels
- A comprehensive 7-day preparation roadmap

### **Action**
- Developed a **Node.js/Express backend** with MongoDB for data persistence
- Integrated **Google GenAI API** for intelligent report generation
- Implemented **JWT-based authentication** with password encryption
- Built a **React frontend** with a 4-layer architecture (API → Hook → State → UI)
- Created a **PDF resume generation** feature using Puppeteer
- Designed responsive UI with animated components and skeleton loaders
- Implemented comprehensive data validation using Zod

### **Result**
- ✅ Users can generate personalized interview reports in seconds
- ✅ Accurate match scores with skill gap analysis
- ✅ 7-day structured preparation plans with daily focus areas
- ✅ Seamless authentication and report history tracking
- ✅ Beautiful, responsive UI with smooth loading states
- ✅ Scalable architecture supporting multiple concurrent users

---

## 🎯 Features

### Core Features
- **🤖 AI-Powered Report Generation** - Uses Google GenAI to analyze resumes and job descriptions
- **📊 Match Score Assessment** - Calculates compatibility between candidate profile and job requirements (0-100)
- **❓ Interview Questions** - Generates 5-7 technical and 5-7 behavioral questions specific to the role
- **🔍 Skill Gap Analysis** - Identifies missing skills with severity levels (Low/Medium/High)
- **📅 7-Day Preparation Plan** - Daily roadmap with focus areas and actionable tasks
- **📄 Resume PDF Generation** - Creates optimized resume PDFs tailored to job descriptions
- **💾 Report History** - Save and retrieve multiple interview preparation reports
- **🔐 Secure Authentication** - JWT-based user authentication with password hashing
- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices

### Advanced Features
- **Real-time Skeleton Loading** - Animated placeholders during report generation
- **Animated UI Components** - Smooth transitions and interactive elements
- **Data Validation** - Zod schema validation for all API requests/responses
- **Error Handling** - Comprehensive error messages and fallback states
- **Multi-format Upload** - Support for PDF resumes with automatic text extraction

---

## 🏗️ Architecture

### Backend Architecture (Node.js/Express)

```
backend/
├── src/
│   ├── controllers/          # Business logic & request handling
│   │   ├── auth.controller.js
│   │   └── interview.controller.js
│   ├── services/            # External service integration
│   │   └── ai.service.js   # Google GenAI integration
│   ├── models/              # MongoDB schemas
│   │   ├── user.model.js
│   │   ├── interview.model.js
│   │   └── blacklist.model.js
│   ├── routes/              # API endpoint definitions
│   │   ├── auth.routes.js
│   │   └── interview.routes.js
│   ├── middlewares/         # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── file.middleware.js
│   ├── config/              # Configuration files
│   │   └── db.js           # Database connection
│   └── app.js              # Express app setup
├── server.js               # Server entry point
└── package.json
```

### Frontend Architecture (React - 4 Layers)

```
frontend/src/features/
├── auth/                    # Authentication Feature
│   ├── components/
│   │   └── Protected.jsx   # Route protection component
│   ├── pages/
│   │   ├── Login.jsx
│   │   └── Register.jsx
│   ├── hooks/
│   │   └── useAuth.js      # Custom auth hook
│   ├── services/
│   │   └── auth.api.js     # API layer
│   ├── auth.context.jsx    # State layer
│   └── auth.form.scss      # UI layer
│
└── interview/              # Interview Feature
    ├── pages/
    │   ├── Home.jsx
    │   ├── interview.jsx
    │   └── dum.js
    ├── hooks/
    │   └── useInterview.js # Custom interview hook
    ├── services/
    │   └── interview.api.js # API layer
    ├── interview.context.jsx # State layer
    └── style/
        ├── home.scss       # UI layer
        └── interview.scss  # UI layer
```

---

## 🔗 Backend API Routes

### Authentication Routes

| Method | Endpoint | Authentication | Description |
|--------|----------|-----------------|-------------|
| `POST` | `/api/auth/register` | None | Register a new user with email and password |
| `POST` | `/api/auth/login` | None | Login user and receive JWT token |
| `GET` | `/api/auth/logout` | None | Logout and invalidate JWT token |
| `GET` | `/api/auth/get-me` | JWT Required | Retrieve current logged-in user details |

### Interview Routes

| Method | Endpoint | Authentication | Description |
|--------|----------|-----------------|-------------|
| `POST` | `/api/interview/` | JWT Required | Generate new interview report (with resume PDF upload) |
| `GET` | `/api/interview/` | JWT Required | Get all interview reports for current user |
| `GET` | `/api/interview/report/:interviewId` | JWT Required | Get specific interview report by ID |
| `POST` | `/api/interview/resume/pdf/:interviewReportId` | JWT Required | Generate optimized resume PDF for specific report |

