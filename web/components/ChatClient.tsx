import React, { useCallback, useEffect, useMemo, useState } from "react";
import { Badge } from "./ui/badge.tsx";
import { Bot, Brain, LayoutDashboard, PanelRightOpen, Sparkles } from "lucide-react";
import { CopilotzChat } from "@copilotz/chat-adapter";
import type {
  ChatConfig,
  ChatUserContext,
  UserCustomField,
} from "@copilotz/chat-ui";
import { type AgentOption, fetchAgents } from "../services/agentsService.ts";
import type { UserProfile } from "../types/userProfile.ts";
import { ProfileSidebar } from "./ProfileSidebar.tsx";

export interface ChatClientProps {
  userId: string;
  onLogout?: () => void;
  onOpenAdmin?: () => void;
}

const suggestions = [
  "Summarize what you already know about me.",
  "Ask me three questions to improve my profile.",
  "Draft a plan for this week based on my goals.",
  "Tell me which memories seem most useful right now.",
];

function extractToolOutput(
  output: Record<string, unknown>,
  toolName: string,
): Record<string, unknown> | null {
  if (Array.isArray(output.toolCalls)) {
    const toolCall = (output.toolCalls as Array<Record<string, unknown>>).find(
      (candidate) => candidate.name === toolName,
    );
    if (toolCall?.output && typeof toolCall.output === "object") {
      return toolCall.output as Record<string, unknown>;
    }
  }

  return output;
}

function isProfileMutationOutput(output: Record<string, unknown>): boolean {
  const toolOutput = extractToolOutput(output, "saveUserContext");
  if (!toolOutput) return false;

  return (
    toolOutput.success === true &&
    Array.isArray(toolOutput.sectionsUpdated)
  );
}

export const ChatClient: React.FC<ChatClientProps> = ({
  userId,
  onLogout,
  onOpenAdmin,
}) => {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [agents, setAgents] = useState<AgentOption[]>([]);
  const [selectedAgentId, setSelectedAgentId] = useState<string | null>(null);
  const [participantIds, setParticipantIds] = useState<string[]>([]);
  const [targetAgentId, setTargetAgentId] = useState<string | null>(null);
  const [profileRefreshToken, setProfileRefreshToken] = useState(0);

  useEffect(() => {
    let active = true;

    const loadAgents = async () => {
      try {
        const nextAgents = await fetchAgents();
        if (!active) return;

        setAgents(nextAgents);
        setSelectedAgentId((current) => current ?? nextAgents[0]?.id ?? null);
        setParticipantIds((current) =>
          current.length > 0 ? current : nextAgents.map((a) => a.id),
        );
        setTargetAgentId((current) => current ?? nextAgents[0]?.id ?? null);
      } catch (error) {
        console.error("[starter:web] Failed to fetch agents", error);
      }
    };

    void loadAgents();

    return () => {
      active = false;
    };
  }, []);

  const handleToolOutput = useCallback((output: Record<string, unknown>) => {
    if (isProfileMutationOutput(output)) {
      setProfileRefreshToken((current) => current + 1);
    }
  }, []);

  const handleProfileChange = useCallback((nextProfile: UserProfile | null) => {
    setProfile(nextProfile);
  }, []);

  const initialContext = useMemo((): ChatUserContext => {
    const customFields = Array.isArray(profile?.customFields?.items) &&
        profile.customFields.items.length > 0
      ? profile.customFields.items as UserCustomField[]
      : [{ key: "userId", label: "User ID", value: userId, type: "text" as const }];

    return {
      ...(profile ?? {}),
      customFields,
      memories: profile?.memories,
    };
  }, [profile, userId]);

  const renderProfileSidebar = useCallback(
    ({ onClose, isMobile }: { onClose: () => void; isMobile: boolean }) => (
      <ProfileSidebar
        userId={userId}
        refreshToken={profileRefreshToken}
        onProfileChange={handleProfileChange}
        onClose={onClose}
        isMobile={isMobile}
      />
    ),
    [handleProfileChange, profileRefreshToken, userId],
  );

  const config = useMemo(
    (): ChatConfig => ({
      branding: {
        logo: <Bot className="h-6 w-6" />,
        avatar: <Sparkles className="h-6 w-6" />,
        title: "Copilotz Starter",
        subtitle: "Domain APIs, profile sidebar, and graph-ready backend",
      },
      customComponent: {
        label: "Profile",
        icon: <PanelRightOpen className="h-5 w-5" />,
      },
      labels: {
        defaultThreadName: "Starter Thread",
      },
      agentSelector: {
        enabled: true,
        hideIfSingle: true,
        mode: "multi",
      },
      headerActions: onOpenAdmin ? (
        <button
          type="button"
          onClick={onOpenAdmin}
          className="inline-flex items-center justify-center h-8 w-8 rounded-md text-sm font-medium transition-all hover:bg-accent hover:text-accent-foreground"
          title="Admin Dashboard"
        >
          <LayoutDashboard className="h-4 w-4" />
        </button>
      ) : null,
    }),
    [onOpenAdmin],
  );

  return (
    <CopilotzChat
      userId={userId}
      userName={profile?.basics?.fullName || userId}
      initialContext={initialContext}
      onToolOutput={handleToolOutput}
      onLogout={onLogout}
      config={config}
      customComponent={renderProfileSidebar}
      suggestions={suggestions}
      agentOptions={agents}
      selectedAgentId={selectedAgentId}
      onSelectAgent={setSelectedAgentId}
      participantIds={participantIds}
      onParticipantsChange={setParticipantIds}
      targetAgentId={targetAgentId}
      onTargetAgentChange={setTargetAgentId}
    />
  );
};
