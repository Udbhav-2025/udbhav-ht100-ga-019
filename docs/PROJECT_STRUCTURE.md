# 📁 Project Structure

This document describes the organized structure of The Agentic Marketer project.

## Root Directory

```
Adflow/
├── app/                    # Next.js application (pages & API routes)
├── components/             # React components
├── docs/                   # All documentation files
├── lib/                    # Backend logic (services, models, types)
├── public/                 # Static assets
├── scripts/                # Utility scripts
├── node_modules/           # Dependencies (auto-generated)
├── .next/                  # Next.js build output (auto-generated)
├── .env                    # Environment variables (not in git)
├── .env.example            # Environment template
├── .gitignore              # Git ignore rules
├── next.config.js          # Next.js configuration
├── package.json            # Dependencies and scripts
├── postcss.config.js       # PostCSS configuration
├── tailwind.config.js      # Tailwind CSS configuration
├── tsconfig.json           # TypeScript configuration
└── README.md               # Main project documentation
```

## Directory Details

### `/app` - Next.js Application
- **`api/`** - API routes (REST endpoints)
- **`campaign/`** - Campaign pages (new, [id])
- **`page.tsx`** - Landing page
- **`layout.tsx`** - Root layout
- **`globals.css`** - Global styles

### `/components` - React Components
- `AnimatedBackground.tsx` - Particle animation background
- `CampaignForm.tsx` - Campaign creation form
- `CampaignResults.tsx` - Results dashboard
- `StatusProgress.tsx` - Progress indicator

### `/docs` - Documentation
- `README.md` - Documentation index
- `QUICKSTART.md` - Quick setup guide
- `SETUP.md` - Installation instructions
- `DEVELOPMENT.md` - Development guide
- `PROJECT_OVERVIEW.md` - Architecture overview
- `CHECKLIST.md` - Setup checklist
- `IMPLEMENTATION.md` - Implementation summary
- `DIRECTORY_STRUCTURE.txt` - Detailed structure
- `INSTALL_COMPLETE.md` - Installation notes
- `START.txt` - Quick reference

### `/lib` - Backend Logic
- **`db/`** - Database connection (MongoDB, memory fallback)
- **`models/`** - Mongoose schemas
- **`services/`** - Business logic
  - `agent.service.ts` - Workflow orchestration
  - `llm.service.ts` - LLM integration (Gemini, OpenAI, Anthropic)
  - `image.service.ts` - Image generation (Stable Diffusion)
  - `scraper.service.ts` - Web scraping
- **`types/`** - TypeScript type definitions

### `/public` - Static Assets
- **`generated/`** - AI-generated images (runtime, gitignored)
- **`placeholders/`** - Fallback placeholder images

### `/scripts` - Utility Scripts
- `check-env.js` - Environment validation
- `setup.ps1` - PowerShell setup automation
- `verify-api.js` - API verification script

## File Organization Principles

1. **Documentation** - All docs in `/docs` folder (except main README.md)
2. **Scripts** - All utility scripts in `/scripts` folder
3. **Code** - Organized by feature/type (app, components, lib)
4. **Assets** - Static files in `/public`
5. **Config** - Configuration files in root (standard for Node.js projects)

## Quick Navigation

- **Start Here**: [README.md](../README.md)
- **Quick Setup**: [docs/QUICKSTART.md](./QUICKSTART.md)
- **Development**: [docs/DEVELOPMENT.md](./DEVELOPMENT.md)
- **Architecture**: [docs/PROJECT_OVERVIEW.md](./PROJECT_OVERVIEW.md)

