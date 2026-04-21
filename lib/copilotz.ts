import { createCopilotz } from "copilotz";

type LLMProviderName = "openai" | "anthropic" | "gemini" | "groq" | "deepseek" | "minimax" | "ollama" | "xai";
type LLMReasoningEffort = "minimal" | "low" | "medium" | "high";

const getCopilotzInstance = async () => {

  const databaseUrl = Deno.env.get("DATABASE_URL") || undefined;

  const copilotz = await createCopilotz({
    dbConfig: { url: databaseUrl },
    resources: {
      path: [
        "./resources",
      ]
    },
    namespace: "copilotz-starter",
    agent: {
      llmOptions: {
        provider: Deno.env.get("LLM_PROVIDER") as LLMProviderName,
        model: Deno.env.get("LLM_MODEL"),
        reasoningEffort: Deno.env.get("LLM_REASONING_EFFORT") as LLMReasoningEffort,
        apiKey: Deno.env.get("LLM_API_KEY"),
        maxTokens: Number(Deno.env.get("LLM_MAX_TOKENS")) || 100000,
      },
    },
    assets: {
      config: {
        backend: "fs",
        namespacing: { mode: "context", includeInRef: true },
        fs: {
          rootDir: Deno.env.get("ASSETS_DIR") || "./assets",
        },
        resolveInLLM: true,
      },
    },
    multiAgent: { 
      enabled: true ,
      maxAgentTurns: 20,
    }
  });
  return copilotz;
};

export default getCopilotzInstance();
