import { apiUrl, withAuthHeaders } from "./api.ts";

type AgentApiItem = {
  id: string;
  name: string;
  description?: string | null;
};

export type AgentOption = {
  id: string;
  name: string;
  description?: string | null;
};

export async function fetchAgents(): Promise<AgentOption[]> {
  const response = await fetch(apiUrl("/v1/agents"), {
    method: "GET",
    headers: withAuthHeaders({ Accept: "application/json" }),
  });

  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || `Failed to fetch agents (${response.status})`);
  }

  const payload = await response.json() as { data?: AgentApiItem[] };
  const data = Array.isArray(payload?.data) ? payload.data : [];

  return data.map((agent) => ({
    id: agent.id,
    name: agent.name,
    description: agent.description ?? undefined,
  }));
}
