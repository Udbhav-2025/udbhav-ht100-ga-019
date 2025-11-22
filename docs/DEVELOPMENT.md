# The Agentic Marketer - Development Guide

## Project Structure

```
d:\Adflow\
├── app/                          # Next.js 14 App Router
│   ├── api/                      # API Routes
│   │   └── campaigns/            # Campaign endpoints
│   │       ├── route.ts          # POST /api/campaigns, GET /api/campaigns
│   │       └── [id]/
│   │           ├── route.ts      # GET /api/campaigns/:id
│   │           ├── status/
│   │           │   └── route.ts  # GET /api/campaigns/:id/status
│   │           └── regenerate/
│   │               └── route.ts  # POST /api/campaigns/:id/regenerate
│   ├── campaign/                 # Campaign pages
│   │   ├── new/
│   │   │   └── page.tsx          # Campaign creation form
│   │   └── [id]/
│   │       └── page.tsx          # Campaign status/results
│   ├── globals.css               # Global styles
│   ├── layout.tsx                # Root layout with Toaster
│   └── page.tsx                  # Landing page
│
├── components/                   # React components
│   ├── AnimatedBackground.tsx    # Dynamic particle background
│   ├── CampaignForm.tsx          # Campaign creation form
│   ├── CampaignResults.tsx       # Results dashboard with tabs
│   └── StatusProgress.tsx        # Progress indicator
│
├── lib/                          # Backend logic
│   ├── db/
│   │   └── mongodb.ts            # Database connection
│   ├── models/
│   │   └── Campaign.model.ts     # Mongoose schema
│   ├── services/                 # Business logic
│   │   ├── scraper.service.ts    # Web scraping
│   │   ├── llm.service.ts        # GPT-4o/Claude integration
│   │   ├── image.service.ts      # Stable Diffusion integration
│   │   └── agent.service.ts      # Agentic workflow orchestration
│   └── types/
│       └── campaign.types.ts     # TypeScript definitions
│
├── public/                       # Static assets
│   ├── generated/                # AI-generated images (created at runtime)
│   └── placeholders/             # Placeholder images
│
├── .env.example                  # Environment variables template
├── .gitignore
├── next.config.js
├── package.json
├── postcss.config.js
├── tailwind.config.js
├── tsconfig.json
└── README.md
```

## Key Features Implemented

### 1. **Backend Services**

#### Scraper Service (`lib/services/scraper.service.ts`)
- Crawls websites using Axios + Cheerio
- Extracts:
  - Brand name, tagline, description
  - Features from lists and headings
  - Tone analysis from text content
  - Target audience inference
  - Positioning analysis
- Error handling with fallbacks

#### LLM Service (`lib/services/llm.service.ts`)
- Supports both OpenAI GPT-4o and Anthropic Claude 3.5
- Functions:
  - `generateContent()` - Creates platform-specific ad copy
  - `critiqueContent()` - AI self-review of generated content
  - `refineContent()` - Improves content based on critique
- Returns structured JSON for clean frontend rendering

#### Image Service (`lib/services/image.service.ts`)
- Integrates with Stability AI API (Stable Diffusion XL)
- Generates platform-optimized dimensions:
  - Instagram: 1024x1024 (square)
  - LinkedIn: 1024x512 (banner)
  - Twitter: 1024x512 (card)
- Saves images to `public/generated/`
- Fallback to placeholders if API unavailable

#### Agent Service (`lib/services/agent.service.ts`)
- Orchestrates the complete workflow:
  1. Research (scraping)
  2. Content generation
  3. Critique
  4. Refinement
  5. Image generation
  6. Final scoring
- Updates campaign status at each step
- Implements quality scoring algorithm

### 2. **API Endpoints**

All endpoints in `app/api/campaigns/`:

- `POST /api/campaigns` - Create new campaign, starts async processing
- `GET /api/campaigns` - List all campaigns
- `GET /api/campaigns/:id` - Get full campaign details
- `GET /api/campaigns/:id/status` - Get current status (for polling)
- `POST /api/campaigns/:id/regenerate` - Regenerate with new parameters

### 3. **Frontend Pages**

#### Landing Page (`app/page.tsx`)
- Hero section with animated background
- "How It Works" section (4 steps)
- Features showcase
- Call-to-action sections
- Fully responsive design

#### Campaign Creation (`app/campaign/new/page.tsx`)
- Form with validation:
  - Website URL (required)
  - Platform selection (multi-select)
  - Tone selection (with custom option)
  - Primary goal selection
- Info cards explaining the process
- Real-time form validation

#### Campaign Status/Results (`app/campaign/[id]/page.tsx`)
- Uses SWR for auto-refreshing data
- Shows progress during processing
- Displays results when complete
- Tabbed interface for different platforms
- Copy-to-clipboard functionality
- Image download buttons
- Regenerate option

### 4. **UI Components**

#### AnimatedBackground
- Canvas-based particle system
- Connecting lines between nearby particles
- Gradient background
- Non-distracting, professional look

#### CampaignForm
- Multi-step form with validation
- Platform toggle buttons with icons
- Dropdown selectors for tone and goal
- Custom tone text input
- Loading states

#### StatusProgress
- Visual progress bar
- Step-by-step status indicator
- Real-time updates
- Error state display
- Completion animations

#### CampaignResults
- Platform tabs (Instagram, LinkedIn, Twitter)
- Content cards with copy buttons
- Image gallery with download
- AI critique panel (collapsible)
- Regenerate button

### 5. **Database Schema**

MongoDB with Mongoose:
- Campaign model with embedded subdocuments
- Indexes on `createdAt` and `status`
- Support for multiple platforms
- Nested structures for:
  - Brand research
  - Generated content (by platform)
  - Generated images
  - Critique summary

### 6. **Styling**

- Tailwind CSS utility-first approach
- Custom animations:
  - Gradient backgrounds
  - Floating elements
  - Shimmer effects
  - Smooth transitions
- Dark theme with blue/purple accent colors
- Glassmorphism effects (backdrop-blur)
- Responsive design (mobile-first)

## Environment Variables Required

```env
# Database
MONGODB_URI=mongodb://localhost:27017/agentic-marketer

# LLM Provider (choose one or both)
OPENAI_API_KEY=sk-...
ANTHROPIC_API_KEY=sk-ant-...
LLM_PROVIDER=openai  # or "anthropic"

# Image Generation
STABILITY_API_KEY=sk-...

# App Config
NODE_ENV=development
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## Workflow Example

1. User visits landing page
2. Clicks "Start a Campaign"
3. Fills form with:
   - Website: `https://example.com`
   - Platforms: Instagram, LinkedIn
   - Tone: Professional
   - Goal: Awareness
4. Submits form → Campaign created with status "pending"
5. Backend starts async processing:
   - Status: "researching" → Scrapes website
   - Status: "generating-content" → Creates ad copy
   - Status: "generating-images" → Creates visuals
   - Status: "critiquing" → AI reviews and refines
   - Status: "completed" → Shows results
6. User sees real-time progress updates
7. Results page shows:
   - Brand summary
   - Platform-specific content
   - Generated images
   - AI critique with score
8. User can:
   - Copy text
   - Download images
   - Regenerate with different tone

## Error Handling

- API errors shown with toast notifications
- Failed campaigns show error state
- Scraping failures return clear error messages
- Image generation falls back to placeholders
- Database connection retry logic
- Frontend polling stops on completion/failure

## Performance Optimizations

- SWR for data fetching and caching
- Conditional polling (only while processing)
- Image optimization with Next.js Image
- Lazy loading of heavy components
- Efficient canvas rendering
- Database indexing

## Testing the App

1. Start MongoDB: `mongod`
2. Install deps: `npm install`
3. Set up `.env` file
4. Run dev server: `npm run dev`
5. Visit `http://localhost:3000`
6. Create a test campaign with any public website
7. Watch the progress
8. View results

## Production Deployment

1. Build: `npm run build`
2. Start: `npm start`
3. Set NODE_ENV=production
4. Use MongoDB Atlas for database
5. Set all API keys in production environment
6. Configure proper CORS if needed
7. Set up CDN for generated images

## Future Enhancements

- User authentication
- Campaign history and analytics
- A/B testing suggestions
- Scheduled posting
- More platforms (Facebook, TikTok)
- Video ad generation
- Performance tracking
- Team collaboration features
