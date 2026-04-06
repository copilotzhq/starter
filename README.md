# Copilotz Starter

A minimal starter template for building AI-powered applications with [Copilotz](https://github.com/copilotzhq/copilotz) and [Oxian](https://jsr.io/@oxian/oxian-js).

## Prerequisites

- [Deno](https://deno.com/) 2.x
- [Node.js](https://nodejs.org/) 18+ (for the web UI)
- An LLM API key (OpenAI, Gemini, Anthropic, etc.)

## Quick Start

```bash
# Copy and configure environment variables
cp .env.example .env
# Edit .env with your API keys

# Start the API server
deno task dev

# In a separate terminal, start the web UI
deno task dev:web
```

Open [http://localhost:5173](http://localhost:5173) to see the app.

## Project Structure

```
├── api/                    # API routes (Oxian file-based routing)
│   ├── dependencies.ts     # Copilotz bootstrap & configuration
│   ├── runAgent.ts         # CLI agent runner
│   └── v1/
│       ├── agents/         # Agent management
│       ├── assets/         # File/asset handling
│       ├── channels/       # Channel integrations (web, WhatsApp, etc.)
│       ├── collections/    # Data collections
│       ├── graph/          # Knowledge graph queries
│       ├── participants/   # User/participant profiles
│       ├── providers/      # LLM provider endpoints
│       └── threads/        # Conversation threads & messages
├── resources/              # Agent resource schemas
│   └── schemas/
├── web/                    # React/Vite frontend
│   ├── components/         # UI components (ChatClient, LoginPage, etc.)
│   ├── services/           # API service layer
│   └── ...
├── oxian.config.ts         # Oxian server configuration
└── deno.json               # Deno configuration & import map
```

## Available Tasks

| Task | Description |
|------|-------------|
| `deno task dev` | Start the API server in development mode |
| `deno task start` | Start the API server in production mode |
| `deno task run:agent` | Run the agent from the CLI |
| `deno task dev:web` | Start the web UI dev server (Vite) |
| `deno task build:web` | Build the web UI for production |

## Configuration

All configuration is done via environment variables. See [`.env.example`](.env.example) for the full list.

Key variables:

| Variable | Description |
|----------|-------------|
| `DATABASE_URL` | Database connection string (SQLite file, PostgreSQL, or `:memory:`) |
| `LLM_PROVIDER` | LLM provider name (`openai`, `gemini`, `anthropic`, etc.) |
| `LLM_MODEL` | Model name (e.g., `gpt-4o`, `gemini-2.5-flash`) |
| `LLM_API_KEY` | API key for the LLM provider |
| `API_KEY` | API key for the Copilotz web UI |

## Learn More

- [Copilotz Documentation](https://github.com/copilotzhq/copilotz)
- [Oxian Documentation](https://jsr.io/@oxian/oxian-js)
