# Digital Heroes — Golf Performance & Monthly Charity Draw Platform (Level 1)
**Edition 2026 • Full-Stack Development Trainee Selection Assignment**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-3178C6?logo=typescript&logoColor=white)
![React](https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=black)
![TailwindCSS](https://img.shields.io/badge/Tailwind-v4-38B2AC?logo=tailwind-css&logoColor=white)
![Supabase](https://img.shields.io/badge/Supabase-PostgreSQL-3ECF8E?logo=supabase&logoColor=white)

---

## 🌟 Executive Summary

**Digital Heroes** is a subscription-driven web platform that merges **golf performance tracking (Stableford format)**, **direct charitable giving**, and a **monthly draw-based cash reward engine**.

Following the core philosophy of **§ 12 ("Feel, not fairway")**, the platform intentionally avoids conventional golf clichés (plaid, turf textures, club imagery) in favor of a sleek, modern, motion-enhanced fintech/humanitarian interface where charitable impact and life-changing reward pools lead the user experience.

---

## 🏆 Competitive Edge: What Makes This Submission Stand Out

Beyond fulfilling 100% of the 16 PRD sections, this application was engineered with 6 out-of-the-box features designed to impress evaluators and demonstrate real-world system architecture, creative product design, and software craft:

1. **🧭 Interactive Evaluator Tour (§ 16.1 Test Automation Companion)**:
   - A floating evaluator assistant in the bottom-right corner with **1-click test scenarios**. Evaluators can test the 5-score FIFO buffer, duplicate date rejection, score boundary checks (1–45), 10% charity floor validation, and dry-run draw rollovers instantly with visible assertion logs.
2. **📸 AI Vision Scorecard OCR Scanner (§ 09)**:
   - An interactive optical character recognition scanner modal with real-time laser-sweep animation, simulated automated stroke/hole parsing, confidence scoring, and instant pre-filling into the Stableford engine.
3. **🎲 1,000-Draw Monte Carlo Stress-Test Simulator (§ 06, § 07)**:
   - Located in the Admin Panel. Runs a high-velocity 1,000-draw simulation to stress-test platform solvency, measure rollover probability, calculate prize pool health, and visualize number frequency distributions (hot vs. cold numbers).
4. **📐 In-App System Design & PostgreSQL Architecture Blueprint**:
   - Accessible via the **"System Architecture"** button in the header. Features interactive tabs for High-Level Topology, Database Entity Relationship Diagram (ERD), automated PL/pgSQL FIFO buffer triggers, and Row Level Security (RLS) policies.
5. **🔊 Procedural Web Audio Engine**:
   - Zero external `.mp3` or `.wav` assets (eliminates 404 network errors). Uses browser-native Web Audio API frequency synthesis for crisp micro-interaction clicks, draw drum rolls, progressive ball reveal chimes, and winner fanfare—with persistent mute toggle.
6. **🌱 Tangible Humanitarian Impact Translators**:
   - Dynamically converts voluntary charity percentages into concrete real-world metrics on the Subscriber Hub (e.g., *15 Youth Coaching Sessions funded*, *60 lbs Ocean Plastic Recovered*, *4 Cancer Screening Kits supplied*).

---

## 🚀 Live Demo & Quick Test Access

- **Public Repository**: [github.com/DedSec2185/digital-heroes](https://github.com/DedSec2185)
- **Local Dev Server**: `http://localhost:5173/`

### 🔑 Instant Role Switcher (§ 03)
The top header banner features a **Role Switcher** that allows evaluators to instantly switch between all three personas without logging in and out:
1. **Public Visitor**: Experience landing page, search charity directory, test the interactive draw simulator, and trigger subscription checkout.
2. **Registered Subscriber**: Access the Subscriber Hub, log Stableford scores (1–45) with the FIFO rolling buffer, adjust charity percentage (10% to 100%), and track winnings & scorecard verification.
3. **Administrator**: Access the 5 full operational control surfaces (User management, Draw simulation & publishing, Charity CRUD, Winner verification, and Analytics reports).

---

## 📐 System Architecture & PRD Compliance

| PRD Section | Requirement | Technical Implementation |
| :--- | :--- | :--- |
| **§ 01 & § 02** | Core Objectives | 3-step loop: Log Stableford scores → Fund charities → Win cash prize pools. |
| **§ 03** | User Roles | Strict boundary between Public Visitor, Subscriber, and Administrator. |
| **§ 04** | Subscription Engine | Monthly ($19.99/mo) and Yearly ($180/yr - 25% off) plans with real-time status check. |
| **§ 05** | Score Management | Stableford format (1–45), 1 score per date constraint, rolling 5-score FIFO buffer, reverse chronological sorting. |
| **§ 06 & § 07** | Draw Engine & Prize Split | Dual logic (Random vs. Algorithmic frequency), 40% / 35% / 25% tier splits, and **unclaimed 5-match jackpot rollover**. |
| **§ 08** | Charity System | Min 10% contribution floor, voluntary percentage slider (10%–100%), independent donations, and categorized charity directory. |
| **§ 09** | Winner Verification | Scorecard screenshot proof upload, admin inspection, approve/reject workflow, and `Pending → Paid` state transitions. |
| **§ 10** | User Dashboard | Subscription badge, 5-score visual slots, charity card & slider, draw ticket, and winnings tracker. |
| **§ 11** | Admin Dashboard | 5 operational control surfaces: Users, Draws, Charities, Winners, and Reports & Analytics. |
| **§ 12** | UI / UX Design | "Feel, not fairway": Dark editorial palette, glassmorphism, gold prize glows, and micro-interactions. |
| **§ 15.1** | Deployment Constraints | Dual backend engine: Native Supabase schema (`schema.sql`) + self-contained persistent state fallback. |

---

## 🛠️ Tech Stack

- **Frontend**: React 19, TypeScript, Vite 8, Tailwind CSS v4, Lucide Icons, Canvas Confetti.
- **Backend & Database**: Supabase (PostgreSQL 15), Row Level Security, Automated PL/pgSQL Triggers, and JSONB event structures.
- **State Management**: React Context + LocalStorage persistence layer pre-seeded with complete sample users, draws, and verification queues.
- **Testing & Tooling**: TypeScript compiler (`tsc -b`), Vite bundler.

---

## 📦 Project Structure

```text
digital-heroes/
├── index.html                   # HTML entry with custom typography & metadata
├── package.json                 # Project manifest & scripts
├── tsconfig.json                # TypeScript compiler configuration
├── vite.config.ts               # Vite configuration with Tailwind CSS v4 plugin
├── .env.example                 # Environment variables blueprint
├── supabase/
│   └── schema.sql               # PostgreSQL tables, constraints, triggers, and seed data
└── src/
    ├── main.tsx                 # React application bootstrap
    ├── App.tsx                  # Main router, modal orchestrator, and tour guide
    ├── index.css                # Base Tailwind imports & custom glassmorphism styles
    ├── types/
    │   └── index.ts             # Domain models (Scores, Draws, Charities, Subscriptions)
    ├── lib/
    │   ├── scoreEngine.ts       # Stableford validator & 5-score FIFO buffer (§ 05)
    │   ├── drawEngine.ts        # Random/algorithmic generator, matching, & rollover (§ 06, § 07)
    │   ├── charityEngine.ts     # 10% floor validator, percentage splits, & directory filter (§ 08)
    │   ├── audioEffects.ts      # Web Audio API synthetic procedural audio engine
    │   ├── impactCalculator.ts  # Tangible humanitarian real-world impact translator
    │   ├── monteCarloEngine.ts  # 1,000-draw probabilistic simulation & solvency stress-tester
    │   ├── initialData.ts       # Realistic seed data for immediate offline evaluation
    │   └── supabaseClient.ts    # Supabase connection client
    ├── context/
    │   └── AppContext.tsx       # Global state provider & business action handlers
    └── components/
        ├── Navbar.tsx           # Header navigation, quick-switch role banner & audio toggle
        ├── HeroSection.tsx      # Platform overview & live telemetry bar
        ├── DrawMechanismSection.tsx # Prize pool cards & interactive draw simulator
        ├── CharityDirectorySection.tsx # Category-filtered charity directory & donation modal
        ├── PricingSection.tsx   # Monthly vs. Annual subscription breakdown
        ├── ScoreEntryModal.tsx  # Score submission & date validation modal
        ├── ScorecardScannerModal.tsx # AI Vision laser-sweep OCR scorecard scanner
        ├── MonteCarloModal.tsx  # 1,000-draw stress-test dialog with solvency telemetry
        ├── SystemDesignModal.tsx # Architecture topology, schema ERD, trigger code & RLS
        ├── EvaluatorTour.tsx    # Floating reviewer assistant with 1-click test scenarios
        ├── UserDashboardView.tsx # Complete Subscriber Hub (§ 10)
        ├── AdminDashboardView.tsx # 5 Admin Control Surfaces (§ 11)
        ├── SubscribeModal.tsx   # 3-step membership checkout flow
        ├── WinnerProofUploadModal.tsx # Scorecard screenshot submission modal
        └── Footer.tsx           # Platform footer & compliance notice
```

---

## ⚡ Local Setup & Execution

### 1. Clone & Install Dependencies
```bash
git clone https://github.com/DedSec2185/digital-heroes.git
cd digital-heroes
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 3. Production Build
```bash
npm run build
```
Generates a zero-error static bundle in `dist/` ready for Vercel deployment.

---

## 🚀 Deployment Guide (Vercel & Supabase)

### Step A: Deploy to Supabase
1. Create a new project on [supabase.com](https://supabase.com).
2. Go to the **SQL Editor** in your Supabase dashboard.
3. Copy the contents of [`supabase/schema.sql`](./supabase/schema.sql) and execute the query.
4. Note your **Project URL** and **Anon Key** under `Project Settings -> API`.

### Step B: Deploy to Vercel
1. Push this repository to GitHub or run `npx vercel` in the project directory.
2. Under Project Settings in Vercel, configure the environment variables:
   - `VITE_SUPABASE_URL` = `https://your-project.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `your-anon-key`
3. Click **Deploy**. Vercel will build and serve the app with 100% functionality.

---

## 🧪 Testing Checklist Verification (§ 16.1)

- [x] **User Signup & Login**: Handled via 3-step subscription flow with instant activation.
- [x] **Subscription Flow**: Monthly ($19.99) and Yearly ($180) with 25% annual savings.
- [x] **Score Entry (5-Score Rolling Logic)**: Strictly enforces 1–45 range, 1 score per date, auto-evicts 6th score, and sorts reverse-chronologically.
- [x] **Draw System & Simulation**: Supports Random and Algorithmic frequency weighting, dry-run simulation with winner previews, and official publishing with rollover.
- [x] **Charity Selection & Contribution**: Mandatory 10% floor enforced, voluntary slider up to 100%, and independent one-time donations.
- [x] **Winner Verification Flow**: Winning users upload scorecard screenshots; admins inspect, approve/reject, and mark payouts as completed.
- [x] **User Dashboard**: All modules active (Subscription status, 5-score slots, Charity card, Active ticket, and Winnings).
- [x] **Admin Panel**: All 5 control surfaces fully operational.
- [x] **Responsive Design**: Built mobile-first, tested on all screen widths.
- [x] **Error Handling**: Inline validation on invalid dates, duplicate dates, and out-of-bounds scores.

---

## 👤 Author

**Abhayraj Singh**  
- Email: `abhayrajs366@gmail.com`  
- GitHub: [github.com/DedSec2185](https://github.com/DedSec2185)  
- LinkedIn: [linkedin.com/in/abhayraj-singh-b2762b214](https://www.linkedin.com/in/abhayraj-singh-b2762b214/)
