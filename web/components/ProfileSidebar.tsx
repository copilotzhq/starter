import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  Brain,
  Plus,
  RefreshCw,
  Save,
  Sparkles,
  Trash2,
  UserRound,
  X,
} from "lucide-react";
import type {
  MemoryItem,
  UserProfile,
} from "../../resources/schemas/userProfile.schema.ts";
import {
  addParticipantMemory,
  deleteParticipantMemory,
  fetchParticipant,
  updateParticipant,
} from "../services/participantsService.ts";
import { Badge } from "./ui/badge.tsx";
import { Button } from "./ui/button.tsx";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "./ui/card.tsx";
import { Input } from "./ui/input.tsx";
import { ScrollArea } from "./ui/scroll-area.tsx";
import { Separator } from "./ui/separator.tsx";
import { Textarea } from "./ui/textarea.tsx";

interface ProfileSidebarProps {
  userId: string;
  refreshToken?: number;
  onProfileChange?: (profile: UserProfile | null) => void;
  onClose?: () => void;
  isMobile?: boolean;
}

type ProfileDraft = {
  basics: NonNullable<UserProfile["basics"]>;
  preferences: {
    language: string;
    tone: string;
    responseStyle: string;
    topicsText: string;
  };
  goals: NonNullable<UserProfile["goals"]>;
};

const emptyDraft = (): ProfileDraft => ({
  basics: {
    fullName: "",
    role: "",
    company: "",
    website: "",
    bio: "",
  },
  preferences: {
    language: "",
    tone: "",
    responseStyle: "",
    topicsText: "",
  },
  goals: {
    shortTerm: "",
    longTerm: "",
    successMetrics: "",
  },
});

const profileToDraft = (profile: UserProfile | null): ProfileDraft => ({
  basics: {
    fullName: profile?.basics?.fullName ?? "",
    role: profile?.basics?.role ?? "",
    company: profile?.basics?.company ?? "",
    website: profile?.basics?.website ?? "",
    bio: profile?.basics?.bio ?? "",
  },
  preferences: {
    language: profile?.preferences?.language ?? "",
    tone: profile?.preferences?.tone ?? "",
    responseStyle: profile?.preferences?.responseStyle ?? "",
    topicsText: Array.isArray(profile?.preferences?.topics)
      ? profile?.preferences?.topics.join(", ")
      : "",
  },
  goals: {
    shortTerm: profile?.goals?.shortTerm ?? "",
    longTerm: profile?.goals?.longTerm ?? "",
    successMetrics: profile?.goals?.successMetrics ?? "",
  },
});

const normalizeTopics = (topicsText: string): string[] => (
  topicsText
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean)
);

function SectionField(
  props: React.PropsWithChildren<{ label: string; className?: string }>,
) {
  return (
    <label className={`grid gap-2 ${props.className ?? ""}`}>
      <span className="text-sm font-medium text-muted-foreground">
        {props.label}
      </span>
      {props.children}
    </label>
  );
}

export const ProfileSidebar: React.FC<ProfileSidebarProps> = ({
  userId,
  refreshToken = 0,
  onProfileChange,
  onClose,
  isMobile = false,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [draft, setDraft] = useState<ProfileDraft>(emptyDraft);
  const [memoryInput, setMemoryInput] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const applyProfile = useCallback((nextProfile: UserProfile | null) => {
    setProfile(nextProfile);
    setDraft(profileToDraft(nextProfile));
    onProfileChange?.(nextProfile);
  }, [onProfileChange]);

  const loadProfile = useCallback(async () => {
    setIsLoading(true);
    setError(null);

    try {
      const nextProfile = await fetchParticipant(userId);
      applyProfile(nextProfile);
    } catch (cause) {
      console.error("[starter:web] Failed to load profile", cause);
      setError(
        cause instanceof Error ? cause.message : "Failed to load profile.",
      );
    } finally {
      setIsLoading(false);
    }
  }, [applyProfile, userId]);

  useEffect(() => {
    void loadProfile();
  }, [loadProfile, refreshToken]);

  const saveSection = useCallback(async (updates: Partial<UserProfile>) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextProfile = await updateParticipant(userId, updates);
      applyProfile(nextProfile);
    } catch (cause) {
      console.error("[starter:web] Failed to save profile", cause);
      setError(
        cause instanceof Error ? cause.message : "Failed to save profile.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [applyProfile, userId]);

  const handleAddMemory = useCallback(async () => {
    if (!memoryInput.trim()) return;

    setIsSaving(true);
    setError(null);

    try {
      const nextProfile = await addParticipantMemory(
        userId,
        memoryInput.trim(),
        "context",
      );
      applyProfile(nextProfile);
      setMemoryInput("");
    } catch (cause) {
      console.error("[starter:web] Failed to add memory", cause);
      setError(
        cause instanceof Error ? cause.message : "Failed to add memory.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [applyProfile, memoryInput, userId]);

  const handleDeleteMemory = useCallback(async (memoryId: string) => {
    setIsSaving(true);
    setError(null);

    try {
      const nextProfile = await deleteParticipantMemory(userId, memoryId);
      applyProfile(nextProfile);
    } catch (cause) {
      console.error("[starter:web] Failed to delete memory", cause);
      setError(
        cause instanceof Error ? cause.message : "Failed to delete memory.",
      );
    } finally {
      setIsSaving(false);
    }
  }, [applyProfile, userId]);

  const customFields = useMemo(() => {
    if (
      Array.isArray(profile?.customFields?.items) &&
      profile.customFields.items.length > 0
    ) {
      return profile.customFields.items;
    }

    return [{
      key: "userId",
      label: "User ID",
      value: userId,
      type: "text" as const,
    }];
  }, [profile?.customFields?.items, userId]);

  return (
    <aside className="flex h-full flex-col bg-background">
      <div className="flex items-start justify-between gap-4 border-b px-4 py-4">
        <div className="space-y-2">
          <Badge variant="outline" className="gap-1">
            <Sparkles size={12} />
            Starter sidebar
          </Badge>
          <div className="space-y-1">
            <h2 className="text-lg font-semibold tracking-tight">
              User profile
            </h2>
            <p className="text-sm text-muted-foreground">
              Keep context close to the chat and update it through the new
              domain APIs.
            </p>
          </div>
        </div>

        <div className="flex gap-2">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            onClick={() => void loadProfile()}
            disabled={isLoading || isSaving}
            aria-label="Refresh profile"
          >
            <RefreshCw size={16} />
          </Button>
          {isMobile && onClose
            ? (
              <Button
                type="button"
                size="icon"
                variant="ghost"
                onClick={onClose}
                aria-label="Close profile"
              >
                <X size={16} />
              </Button>
            )
            : null}
        </div>
      </div>

      <ScrollArea className="flex-1 min-h-0" viewportClassName="px-4 py-4">
        <div className="space-y-4">
          {error
            ? (
              <div className="rounded-lg border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
                {error}
              </div>
            )
            : null}

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <div className="flex items-center gap-2">
                <UserRound size={16} />
                <CardTitle className="text-base">Basics</CardTitle>
              </div>
              <CardDescription>
                Core identity fields that help the assistant personalize tone
                and context.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <div className="grid gap-4 md:grid-cols-2">
                <SectionField label="Full name">
                  <Input
                    value={draft.basics.fullName ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        basics: {
                          ...current.basics,
                          fullName: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
                <SectionField label="Role">
                  <Input
                    value={draft.basics.role ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        basics: {
                          ...current.basics,
                          role: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
                <SectionField label="Company">
                  <Input
                    value={draft.basics.company ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        basics: {
                          ...current.basics,
                          company: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
                <SectionField label="Website">
                  <Input
                    value={draft.basics.website ?? ""}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        basics: {
                          ...current.basics,
                          website: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
              </div>
              <SectionField label="Bio">
                <Textarea
                  rows={3}
                  value={draft.basics.bio ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      basics: { ...current.basics, bio: event.target.value },
                    }))}
                />
              </SectionField>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void saveSection({ basics: draft.basics })}
                disabled={isLoading || isSaving}
              >
                <Save size={15} />
                Save basics
              </Button>
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <div className="flex items-center gap-2">
                <Sparkles size={16} />
                <CardTitle className="text-base">Preferences</CardTitle>
              </div>
              <CardDescription>
                Communication settings that shape the assistant’s style.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <div className="grid gap-4 md:grid-cols-2">
                <SectionField label="Language">
                  <Input
                    value={draft.preferences.language}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        preferences: {
                          ...current.preferences,
                          language: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
                <SectionField label="Tone">
                  <Input
                    value={draft.preferences.tone}
                    onChange={(event) =>
                      setDraft((current) => ({
                        ...current,
                        preferences: {
                          ...current.preferences,
                          tone: event.target.value,
                        },
                      }))}
                  />
                </SectionField>
              </div>
              <SectionField label="Response style">
                <Input
                  value={draft.preferences.responseStyle}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      preferences: {
                        ...current.preferences,
                        responseStyle: event.target.value,
                      },
                    }))}
                />
              </SectionField>
              <SectionField label="Topics">
                <Input
                  value={draft.preferences.topicsText}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      preferences: {
                        ...current.preferences,
                        topicsText: event.target.value,
                      },
                    }))}
                  placeholder="product strategy, travel, finance"
                />
              </SectionField>
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  void saveSection({
                    preferences: {
                      language: draft.preferences.language,
                      tone: draft.preferences.tone,
                      responseStyle: draft.preferences.responseStyle,
                      topics: normalizeTopics(draft.preferences.topicsText),
                    },
                  })}
                disabled={isLoading || isSaving}
              >
                <Save size={15} />
                Save preferences
              </Button>
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <div className="flex items-center gap-2">
                <Brain size={16} />
                <CardTitle className="text-base">Goals</CardTitle>
              </div>
              <CardDescription>
                Short and long-term aims the assistant should keep in view.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <SectionField label="Short-term goal">
                <Textarea
                  rows={2}
                  value={draft.goals.shortTerm ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      goals: {
                        ...current.goals,
                        shortTerm: event.target.value,
                      },
                    }))}
                />
              </SectionField>
              <SectionField label="Long-term goal">
                <Textarea
                  rows={2}
                  value={draft.goals.longTerm ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      goals: {
                        ...current.goals,
                        longTerm: event.target.value,
                      },
                    }))}
                />
              </SectionField>
              <SectionField label="Success metrics">
                <Input
                  value={draft.goals.successMetrics ?? ""}
                  onChange={(event) =>
                    setDraft((current) => ({
                      ...current,
                      goals: {
                        ...current.goals,
                        successMetrics: event.target.value,
                      },
                    }))}
                />
              </SectionField>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void saveSection({ goals: draft.goals })}
                disabled={isLoading || isSaving}
              >
                <Save size={15} />
                Save goals
              </Button>
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <CardTitle className="text-base">Custom fields</CardTitle>
              <CardDescription>
                Starter surfaces custom fields read-only so the profile schema
                stays extensible.
              </CardDescription>
            </CardHeader>
            <CardContent className="flex flex-wrap gap-2 px-4">
              {customFields.map((field) => (
                <Badge
                  key={field.key}
                  variant="outline"
                  className="max-w-full gap-1 px-3 py-1.5"
                >
                  <span className="font-semibold">
                    {field.label ?? field.key}:
                  </span>
                  <span className="truncate">{String(field.value ?? "")}</span>
                </Badge>
              ))}
            </CardContent>
          </Card>

          <Card className="gap-4 py-4">
            <CardHeader className="px-4">
              <div className="flex items-center gap-2">
                <Brain size={16} />
                <CardTitle className="text-base">Memories</CardTitle>
              </div>
              <CardDescription>
                Persistent facts and working context that the assistant can
                reuse.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4 px-4">
              <SectionField label="Add memory">
                <Textarea
                  rows={3}
                  value={memoryInput}
                  onChange={(event) => setMemoryInput(event.target.value)}
                  placeholder="Add something the assistant should remember."
                />
              </SectionField>
              <Button
                type="button"
                variant="secondary"
                onClick={() => void handleAddMemory()}
                disabled={isLoading || isSaving ||
                  memoryInput.trim().length === 0}
              >
                <Plus size={15} />
                Add memory
              </Button>

              <Separator />

              <div className="space-y-3">
                {(profile?.memories?.items ?? []).length === 0
                  ? (
                    <p className="text-sm text-muted-foreground">
                      No memories saved yet.
                    </p>
                  )
                  : (profile?.memories?.items ?? []).map((
                    memory: MemoryItem,
                  ) => (
                    <div
                      key={memory.id}
                      className="flex items-start justify-between gap-3 rounded-lg border p-3"
                    >
                      <div className="space-y-2">
                        <p className="text-sm leading-6">{memory.content}</p>
                        <div className="flex flex-wrap gap-2">
                          <Badge variant="outline">
                            {(memory.category ?? "other").toUpperCase()}
                          </Badge>
                          <Badge variant="secondary">{memory.source}</Badge>
                        </div>
                      </div>
                      <Button
                        type="button"
                        size="icon"
                        variant="ghost"
                        onClick={() => void handleDeleteMemory(memory.id)}
                        aria-label={`Delete memory ${memory.id}`}
                        disabled={isSaving}
                      >
                        <Trash2 size={15} />
                      </Button>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </ScrollArea>
    </aside>
  );
};
