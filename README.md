# ClearMind 
**AI-Powered Decision Matrix Workspace**

ClearMind is a structured decision-making platform that combines the traditional Weighted Decision Matrix method with modern AI analysis to help individuals make clearer, more rational choices.

## The Problem
Making important decisions is often overwhelming. We suffer from:
- **Decision Paralysis**: Too many options and variables.
- **Cognitive Bias**: Emotional attachment to specific outcomes.
- **Lack of Structure**: Mental loops without concrete comparison.

ClearMind solves this by enforcing a structured evaluation process (Options vs. Criteria) and challenging your thinking with AI.

## Features
- **Project Board**: Organize multiple decisions in a clean dashboard.
- **Weighted Decision Matrix**:
  - Define **Options** (Choices you have).
  - Define **Criteria** (What matters) & assign weights (1-5).
  - **Score** each intersection to calculate the objective "Winner".
- **AI Decision Analysis**:
  - Integrated "Challenge My Thinking" button.
  - Uses specific prompts to identify blind spots, biases, and missing criteria.
  - Powered by Groq (LLaMA 3.1).
- **Outcome Review**: Track and review the success of your decisions after the fact.
- **Secure Authentication**: User accounts via NextAuth v5.

## Architecture
Built with a modern, type-safe stack:

- **Framework**: [Next.js 16](App Router, Server Actions)
- **Language**: TypeScript
- **Database**: PostgreSQL with [Prisma ORM]
- **Authentication**: [Auth.js (NextAuth v5)]
- **Styling**: [Tailwind CSS] & [shadcn/ui]
- **AI Provider**: [Groq SDK](Model: `llama-3.1-8b-instant`)

## AI Usage
ClearMind uses AI as a **facilitator**, not a decision-maker.
- **Logic**: The app sends the structured decision data (Options, Criteria, Scores) to the LLM.
- **Goal**: The AI is prompted to play "Devil's Advocate", pointing out risks and second-order effects you might have missed.
- **Privacy**: No decision data is used for training.

## � How It Works (Example Scenario)

Let's say you're **Buying a New Car** .

1.  **Define Options**: You list your top choices:
    - *Tesla Model 3*
    - *Toyota Camry Hybrid*
    - *Ford Mustang*
2.  **Define Criteria**: You decide what matters most:
    - *Price* (Weight: 5/5 - Very Important)
    - *Fun to Drive* (Weight: 3/5 - Nice to have)
    - *Fuel Efficiency* (Weight: 4/5 - Important)
3.  **Score**: You rate each car on each criterion (1-5 scale).
    - *Tesla*: Price (2), Fun (5), Efficiency (5) -> Total: **45**
    - *Toyota*: Price (5), Fun (2), Efficiency (5) -> Total: **51**
    - *Ford*: Price (3), Fun (5), Efficiency (2) -> Total: **38**
    - **Winner**: Toyota Camry!
4.  **AI Analysis**: You click "Challenge My Thinking".
    - *AI Feedback*: "You rated 'Price' highly, but haven't considered 'Resale Value' or 'Maintenance Costs'. A Tesla might be cheaper long-term despite the high upfront price. Also, consider if 'Charging Infrastructure' is a dealbreaker for you."

This logical flow ensures you aren't just choosing the flashiest option, but the one that truly fits your needs.

## How to Run

### Prerequisites
- Node.js 18+
- PostgreSQL Database URL
- Groq API Key

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/SourabhKalburgi/clearmind.git
   cd clearmind
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up Environment Variables**
   Create a `.env` file in the root:
   ```env
   DATABASE_URL="postgresql://..."
   AUTH_SECRET="your_auth_secret"
   GROQ_API_KEY="your_groq_api_key"
   ```

4. **Initialize Database**
   ```bash
   npx prisma migrate dev --name init
   ```

5. **Run the Development Server**
   ```bash
   npm run dev
   ```

## Future Improvements
- **Collaboration**: Shared workspaces for team decisions.
- **Templates**: Pre-filled matrices for common decisions (e.g., Hiring, Software Selection).
- **Export**: PDF/CSV export for presentations.
- **History Tracking**: Version control for changing scores.

---

