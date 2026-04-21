import React from "react";
import { CopilotzAdmin } from "@copilotz/admin";
import { ArrowLeft, LayoutDashboard } from "lucide-react";
import { API_BASE, withAuthHeaders } from "../services/api.ts";

export interface AdminClientProps {
  onBackToChat?: () => void;
}

export const AdminClient: React.FC<AdminClientProps> = ({ onBackToChat }) => {
  return (
    <CopilotzAdmin
      config={{
        baseUrl: API_BASE,
        getRequestHeaders: async () => withAuthHeaders(),
        branding: {
          logo: (
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <LayoutDashboard className="h-4 w-4" />
            </div>
          ),
          title: "Copilotz Starter Admin",
          subtitle: "Operational visibility",
          actions: onBackToChat ? (
            <button
              type="button"
              onClick={onBackToChat}
              className="inline-flex items-center gap-2 rounded-md border bg-background px-3 py-1.5 text-xs font-medium shadow-xs transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <ArrowLeft className="h-3.5 w-3.5" />
              Chat
            </button>
          ) : null,
        },
      }}
    />
  );
};
