import type {
  MemoryItem,
  UserProfile,
} from "../../resources/schemas/userProfile.schema.ts";
import { apiUrl, withAuthHeaders } from "./api.ts";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function participantUrl(
  userId: string,
  extra?: Record<string, string>,
): string {
  const query = extra ? `?${new URLSearchParams(extra).toString()}` : "";
  return apiUrl(`/v1/participants/${encodeURIComponent(userId)}${query}`);
}

export async function fetchParticipant(
  userId: string,
): Promise<UserProfile | null> {
  const response = await fetch(participantUrl(userId), {
    method: "GET",
    headers: withAuthHeaders({ Accept: "application/json" }),
  });

  const payload = await parseJsonResponse<{ data?: UserProfile | null }>(
    response,
  );
  return payload.data ?? null;
}

export async function updateParticipant(
  userId: string,
  updates: Partial<UserProfile>,
  options: { replaceMemories?: boolean } = {},
): Promise<UserProfile | null> {
  const response = await fetch(
    participantUrl(
      userId,
      options.replaceMemories ? { replaceMemories: "true" } : undefined,
    ),
    {
      method: "PUT",
      headers: withAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify(updates),
    },
  );

  const payload = await parseJsonResponse<{ data?: UserProfile | null }>(
    response,
  );
  return payload.data ?? null;
}

function generateMemoryId(): string {
  return `mem_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;
}

async function replaceMemories(
  userId: string,
  items: MemoryItem[],
): Promise<UserProfile | null> {
  return updateParticipant(
    userId,
    { memories: { items } },
    { replaceMemories: true },
  );
}

export async function addParticipantMemory(
  userId: string,
  content: string,
  category: MemoryItem["category"] = "other",
): Promise<UserProfile | null> {
  const currentParticipant = await fetchParticipant(userId);
  const currentMemories = currentParticipant?.memories?.items ?? [];
  const nextMemory: MemoryItem = {
    id: generateMemoryId(),
    content,
    category,
    source: "user",
    createdAt: new Date().toISOString(),
  };

  return replaceMemories(userId, [...currentMemories, nextMemory]);
}

export async function deleteParticipantMemory(
  userId: string,
  memoryId: string,
): Promise<UserProfile | null> {
  const currentParticipant = await fetchParticipant(userId);
  const currentMemories = currentParticipant?.memories?.items ?? [];
  const remaining = currentMemories.filter((memory) => memory.id !== memoryId);
  return replaceMemories(userId, remaining);
}
