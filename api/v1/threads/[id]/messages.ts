import type { Context, Data } from "oxian-js/types";
import { createMessageHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/threads/:id/messages */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const messages = createMessageHandlers(copilotz);
  const threadId = context.request.pathParams?.id ?? data.id;

  if (!threadId) throw { status: 400, message: "Thread id is required" };

  const url = new URL(context.request.url);
  const limit = url.searchParams.get("limit");

  return {
    data: await messages.listFromGraph(
      threadId as string,
      limit ? Number(limit) : undefined,
    ),
  };
};

/** DELETE /v1/threads/:id/messages */
export const DELETE = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const messages = createMessageHandlers(copilotz);
  const threadId = context.request.pathParams?.id ?? data.id;

  if (!threadId) throw { status: 400, message: "Thread id is required" };

  await messages.deleteForThread(threadId as string);
  return { status: 204 };
};
