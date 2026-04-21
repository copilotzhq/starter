import type {
  MemoryItem,
  UserProfile,
} from "../types/userProfile.ts";
import { apiUrlObject, withAuthHeaders } from "./api.ts";

type ParticipantRecord = {
  id: string;
  externalId: string;
  participantType: "human" | "agent";
  name?: string | null;
  email?: string | null;
  metadata?: UserProfile | null;
  createdAt?: string;
  updatedAt?: string;
};

const namespace = "copilotz-starter";

async function parseJsonResponse<T>(response: Response): Promise<T> {
  if (!response.ok) {
    const errorText = await response.text().catch(() => response.statusText);
    throw new Error(errorText || `Request failed (${response.status})`);
  }

  return response.json() as Promise<T>;
}

function profileUrl(
  userId: string,
): string {
  const url = apiUrlObject(
    `/v1/collections/participant/${encodeURIComponent(userId)}`,
  );
  url.searchParams.set("namespace", namespace);
  return url.toString();
}

function profilesUrl(userId: string): string {
  const url = apiUrlObject("/v1/collections/participant");
  url.searchParams.set("namespace", namespace);
  return url.toString();
}

function normalizeProfile(
  record: ParticipantRecord | UserProfile | null | undefined,
): UserProfile | null {
  if (!record || typeof record !== "object") return null;
  if ("metadata" in record) {
    const participant = record as ParticipantRecord;
    return {
      ...(participant.metadata ?? {}),
      id: participant.externalId,
      createdAt: participant.createdAt ?? participant.metadata?.createdAt,
      updatedAt: participant.updatedAt ?? participant.metadata?.updatedAt,
    } as UserProfile;
  }
  return record as UserProfile;
}

async function fetchProfileRecord(
  userId: string,
): Promise<ParticipantRecord | null> {
  const response = await fetch(profileUrl(userId), {
    method: "GET",
    headers: withAuthHeaders({ Accept: "application/json" }),
  });

  if (response.status === 404) {
    return null;
  }

  const payload = await parseJsonResponse<{ data?: ParticipantRecord | null }>(
    response,
  );
  return payload.data ?? null;
}

function deepMerge<T extends Record<string, unknown>>(target: T, source: Partial<T>): T {
  const result = { ...target };

  for (const key of Object.keys(source) as (keyof T)[]) {
    const sourceValue = source[key];
    const targetValue = result[key];

    if (sourceValue === undefined) continue;

    if (
      sourceValue !== null &&
      typeof sourceValue === "object" &&
      !Array.isArray(sourceValue) &&
      targetValue !== null &&
      typeof targetValue === "object" &&
      !Array.isArray(targetValue)
    ) {
      result[key] = deepMerge(
        targetValue as Record<string, unknown>,
        sourceValue as Record<string, unknown>,
      ) as T[keyof T];
    } else {
      result[key] = sourceValue as T[keyof T];
    }
  }

  return result;
}

export async function fetchParticipant(
  userId: string,
): Promise<UserProfile | null> {
  return normalizeProfile(await fetchProfileRecord(userId));
}

export async function updateParticipant(
  userId: string,
  updates: Partial<UserProfile>,
  options: { replaceMemories?: boolean } = {},
): Promise<UserProfile | null> {
  const existing = await fetchProfileRecord(userId);
  const base = (existing?.metadata ?? { id: userId }) as Record<string, unknown>;
  const next = deepMerge(base, updates as Record<string, unknown>) as
    & Record<string, unknown>
    & UserProfile;

  next.id = userId;
  next.updatedAt = new Date().toISOString();

  if (options.replaceMemories && updates.memories) {
    next.memories = updates.memories;
  }

  const response = await fetch(
    existing ? profileUrl(userId) : profilesUrl(userId),
    {
      method: existing ? "PUT" : "POST",
      headers: withAuthHeaders({
        "Content-Type": "application/json",
        Accept: "application/json",
      }),
      body: JSON.stringify({
        ...(existing?.id ? { id: existing.id } : {}),
        externalId: userId,
        participantType: "human",
        name: typeof next.basics?.fullName === "string" ? next.basics.fullName : null,
        metadata: next,
      }),
    },
  );

  const payload = await parseJsonResponse<{ data?: ParticipantRecord | null }>(
    response,
  );
  return normalizeProfile(payload.data ?? null);
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
