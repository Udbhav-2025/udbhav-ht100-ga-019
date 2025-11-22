# The Agentic Marketer

A production-ready AI-powered autonomous marketing campaign creator that researches brands, generates multi-platform ad content, creates visual assets, and self-critiques everything before presenting polished campaigns.

## Features

- 🔍 **Intelligent Brand Research** - Crawls and analyzes brand websites to understand positioning, audience, and tone
- 📝 **Multi-Platform Content Creation** - Generates optimized copy for Instagram, LinkedIn, and Twitter/X
- 🎨 **AI-Generated Visuals** - Creates custom ad banners using Stable Diffusion
- 🤖 **Self-Critique System** - Uses multi-agent workflow to review and refine all content
- 💼 **Professional Dashboard** - Modern, responsive UI with live backgrounds and smooth animations

## Tech Stack

- **Frontend**: Next.js 14, React 18, TypeScript, Tailwind CSS
- **Backend**: Next.js API Routes
- **Database**: MongoDB with Mongoose
- **AI/ML**: 
  - OpenAI GPT-4o / Anthropic Claude 3.5 for content generation
  - Stable Diffusion for image generation
  - Multi-agent workflow orchestration (agentic pattern)
- **Web Scraping**: Cheerio + Axios

## Prerequisites

- Node.js 18+ 
- MongoDB (local or Atlas)
- API Keys:
  - OpenAI API key OR Anthropic API key
  - Stability AI API key

## Installation

1. **Clone and install dependencies**
```bash
npm install
```

2. **Set up environment variables**
```bash
cp .env.example .env
```

Edit `.env` and add your API keys:
```env
MONGODB_URI=mongodb://localhost:27017/agentic-marketer
OPENAI_API_KEY=sk-your-openai-api-key-here
ANTHROPIC_API_KEY=sk-ant-your-anthropic-api-key-here
STABILITY_API_KEY=sk-your-stability-api-key-here
LLM_PROVIDER=openai
```

3. **Start MongoDB** (if running locally)
```bash
mongod
```

4. **Run the development server**
```bash
npm run dev
```

5. **Open your browser**
Navigate to [http://localhost:3000](http://localhost:3000)

## Production Build

```bash
npm run build
npm start
```

## Project Structure

```
agentic-marketer/
├── app/                      # Next.js app directory
│   ├── api/                  # API routes
│   │   └── campaigns/        # Campaign endpoints
│   ├── campaign/             # Campaign pages
│   ├── globals.css          # Global styles
│   ├── layout.tsx           # Root layout
│   └── page.tsx             # Landing page
├── components/               # React components
│   ├── AnimatedBackground.tsx
│   ├── CampaignForm.tsx
│   ├── CampaignResults.tsx
│   └── StatusProgress.tsx
├── lib/                      # Backend logic
│   ├── db/                   # Database connection
│   ├── models/               # Mongoose models
│   ├── services/             # Business logic
│   │   ├── llm.service.ts
│   │   ├── scraper.service.ts
│   │   ├── image.service.ts
│   │   └── agent.service.ts
│   └── types/                # TypeScript types
├── public/                   # Static assets
├── .env.example             # Environment template
├── package.json
├── tsconfig.json
└── README.md
```

## Usage

1. **Start a Campaign**: Click "Start a Campaign" on the landing page
2. **Enter Details**: 
   - Provide a brand website URL
   - Select target platforms (Instagram, LinkedIn, Twitter/X)
   - Choose tone (Professional, Playful, Bold, Minimal, or Custom)
   - Select primary goal (Awareness, Engagement, Clicks, Conversions)
3. **Watch Progress**: Monitor real-time status as AI agents work
4. **Review Results**: 
   - View generated copy for each platform
   - Download AI-generated visual assets
   - Read AI critique and suggestions
   - Copy text or regenerate with different parameters

## API Endpoints

- `POST /api/campaigns` - Create new campaign
- `GET /api/campaigns/:id` - Get campaign details
- `GET /api/campaigns/:id/status` - Get campaign status
- `POST /api/campaigns/:id/regenerate` - Regenerate campaign content
- `GET /api/campaigns` - List all campaigns

## Key Features Implementation

### Research Agent
- Crawls provided URL using Cheerio
- Extracts brand name, tagline, descriptions, features
- Analyzes tone, audience, and positioning

### Content Creation
- Uses GPT-4o or Claude 3.5 for high-quality copy
- Platform-specific optimization
- Structured JSON output for clean rendering

### Image Generation
- Stable Diffusion API integration
- Platform-specific dimensions (Instagram 1080x1080, LinkedIn 1200x628)
- Brand-aligned visual generation

### Self-Critique Workflow
- LangGraph orchestration
- Creator → Critic → Reviser agent flow
- Quality assurance before user sees results

## Troubleshooting

**MongoDB Connection Error**
- Ensure MongoDB is running
- Check MONGODB_URI in .env

**API Key Errors**
- Verify all API keys are valid
- Check quota limits on provider dashboards

**Image Generation Fails**
- Confirm Stability AI API key is active
- Check internet connection

## License

MIT

## Contributing

Pull requests welcome! Please ensure code follows the existing style and includes appropriate tests.
