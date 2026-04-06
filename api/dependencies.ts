import { type Copilotz, createCopilotz } from "copilotz";

type LLMProviderName = "openai" | "anthropic" | "gemini" | "groq" | "deepseek" | "minimax" | "ollama" | "xai";
type LLMReasoningEffort = "minimal" | "low" | "medium" | "high";

const dependencies = async (deps: Record<string, unknown>) => {

  const copilotz = await createCopilotz({
    dbConfig: { url: Deno.env.get("DATABASE_URL") },
    resources: { path: "./resources" },
    copilotzAgent: {
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
          rootDir: Deno.env.get("ASSETS_DIR") ||
            new URL("../assets", import.meta.url).pathname,
        },
        resolveInLLM: true,
      },
    },
    multiAgent: { 
      enabled: true ,
      maxAgentTurns: 20,
    },
    stream: true,
  }) as Copilotz;

  return { ...deps, copilotz };
};

export type Dependencies = Awaited<ReturnType<typeof dependencies>>;

export default dependencies;
