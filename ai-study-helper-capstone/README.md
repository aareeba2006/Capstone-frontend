# AI Study Helper

## Project Brief
AI Study Helper solves a simple problem: students sometimes need quick, beginner-friendly explanations of difficult topics. The app allows a user to ask a study question and receive an AI-generated answer. I chose this idea because it is small enough to complete while still using a meaningful AI capability.

## What it does and who it is for
The app is for students who want simple explanations of study topics. Users type a question, submit it, and receive an AI-generated response.

## Setup
1. Download or clone this repository.
2. Run `npm install`.
3. Create `.env.local` and add your Anthropic API key:
   `ANTHROPIC_API_KEY=your_key_here`
4. Run `npm run dev`.
5. Open the local URL shown in the terminal.

## Usage examples
- "Explain binary search in simple words."
- "What is the difference between HTML and CSS?"
- "Explain a pointer in C++."

## Architecture
User → React/Next.js interface → `/api/ask` route → Claude API → Response → User interface

- **Frontend:** collects the question and displays loading, error, and answer states.
- **API route:** validates input and communicates with Claude.
- **Claude:** generates a beginner-friendly response.

## AI integration
Claude is used to generate explanations based on the user's question. The system instruction asks for clear, accurate, beginner-friendly answers and tells the model not to invent information when uncertain. This makes AI the core feature of the app rather than just an extra chatbot.

## Guardrails and error handling
- Empty questions are blocked.
- Questions over 1000 characters are rejected.
- Missing API configuration shows a safe error.
- AI/API failures show a friendly fallback message instead of crashing.

## Testing
A unit test is included for the main page to confirm that the key interface elements render correctly.

Run:
`npm test`

## V2 evaluation results
Manual checks performed:
- Normal question: expected answer returned when the API is configured.
- Empty input: validation message shown.
- Long input: safely rejected by the API route.
- Service failure: friendly error message returned.
- Loading state: submit button shows "Thinking..." while waiting.

## Limitations
- AI answers can occasionally be inaccurate.
- The app requires an internet connection and a working AI API.
- The app does not currently save conversation history.
- Testing coverage is intentionally small for this capstone version.

## Future improvements
- Add conversation history.
- Add more unit and end-to-end tests.
- Add user accounts and saved study topics.
- Add source links or citations for answers.

## Deployment
This project is ready to deploy to Vercel.

1. Push the project to GitHub.
2. Import the repository into Vercel.
3. Add `ANTHROPIC_API_KEY` in Vercel Environment Variables.
4. Deploy.
5. Test the live application.

### Rollback plan
If a deployment causes a problem, redeploy the last stable commit from the main branch using Vercel's deployment history.

## Accessibility and performance
The interface uses visible labels, keyboard-focus styles, semantic HTML, readable text, and status/error messages. Run Lighthouse and an accessibility audit after deployment and record the actual results.
