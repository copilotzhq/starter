import type { Context, Data } from "oxian-js/types";
import { createEventHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/threads/:id/events/next-pending */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const events = createEventHandlers(copilotz);
  const threadId = context.request.pathParams?.id ?? data.id;

  if (!threadId) throw { status: 400, message: "Thread id is required" };

  const url = new URL(context.request.url);
  const status = url.searchParams.get("status");

  if (status === "processing") {
    return { data: await events.getProcessing(threadId as string) };
  }

  return { data: await events.getNextPending(threadId as string) };
};

/** POST /v1/threads/:id/events - Enqueue a new event. */
export const POST = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const events = createEventHandlers(copilotz);
  const threadId = context.request.pathParams?.id ?? data.id;

  if (!threadId) throw { status: 400, message: "Thread id is required" };

  const body = await context.request.body as Record<string, unknown>;
  const result = await events.enqueue(
    threadId as string,
    body as unknown as Parameters<
      ReturnType<typeof createEventHandlers>["enqueue"]
    >[1],
  );

  return { status: 201, body: result };
};
