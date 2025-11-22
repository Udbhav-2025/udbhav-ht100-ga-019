# Install dependencies
npm install

# Create .env file
cp .env.example .env

# Edit .env and add your API keys:
# - MONGODB_URI (local or MongoDB Atlas)
# - OPENAI_API_KEY or ANTHROPIC_API_KEY
# - STABILITY_API_KEY
# - Set LLM_PROVIDER to "openai" or "anthropic"

# Start MongoDB (if running locally)
# mongod

# Run development server
npm run dev

# Open browser to http://localhost:3000
