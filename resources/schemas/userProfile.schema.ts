export type MemoryItem = {
  id: string;
  content: string;
  category?: "preference" | "fact" | "goal" | "context" | "other";
  source: "agent" | "user";
  createdAt: string;
  updatedAt?: string;
};

export type UserProfile = {
  basics?: {
    fullName?: string;
    role?: string;
    company?: string;
    website?: string;
    bio?: string;
  };
  preferences?: {
    language?: string;
    tone?: string;
    responseStyle?: string;
    topics?: string[];
  };
  goals?: {
    shortTerm?: string;
    longTerm?: string;
    successMetrics?: string;
  };
  customFields?: {
    items?: Array<{
      key: string;
      label?: string;
      value?: string | number | boolean | null;
      type?: "text" | "email" | "phone" | "url" | "date" | "number" | "boolean";
    }>;
  };
  memories?: {
    items?: MemoryItem[];
  };
  updatedAt?: string;
};
