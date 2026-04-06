import type { Context, Data } from "oxian-js/types";
import { createThreadHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/threads?participantId=... */
export const GET = async (
  data: Data & {
    participantId?: string;
    status?: "active" | "archived" | "all";
    order?: "asc" | "desc";
  },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);

  const participantId = data.participantId ??
    context.request.query?.participantId as string;
  if (!participantId) {
    throw { status: 400, message: "participantId query parameter is required" };
  }

  const url = new URL(context.request.url);
  const limit = url.searchParams.get("limit");
  const offset = url.searchParams.get("offset");
  const status = (url.searchParams.get("status") ?? data.status) as
    | "active"
    | "archived"
    | "all"
    | null;
  const order = (url.searchParams.get("order") ?? data.order) as
    | "asc"
    | "desc"
    | null;

  return {
    data: await threads.list(participantId, {
      status: status === "active" || status === "archived" || status === "all"
        ? status
        : undefined,
      limit: limit ? Number(limit) : undefined,
      offset: offset ? Number(offset) : undefined,
      order: order === "asc" || order === "desc" ? order : undefined,
    }),
  };
};

/** POST /v1/threads - Create or find a thread. */
export const POST = async (
  data: Data,
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);
  const body = await context.request.body as Record<string, unknown>;

  const thread = await threads.findOrCreate(
    body.id as string | undefined,
    body as Parameters<
      ReturnType<typeof createThreadHandlers>["findOrCreate"]
    >[1],
  );

  return { status: 201, body: thread };
};
