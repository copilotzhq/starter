import type { Context, Data } from "oxian-js/types";
import { createThreadHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/threads/:id */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Thread id is required" };

  const thread = await threads.getById(id as string);
  if (!thread) throw { status: 404, message: "Thread not found" };

  return { data: thread };
};

/** PATCH /v1/threads/:id */
export const PATCH = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Thread id is required" };

  const body = await context.request.body as Parameters<
    ReturnType<typeof createThreadHandlers>["update"]
  >[1];
  const updated = await threads.update(id as string, body);
  if (!updated) throw { status: 404, message: "Thread not found" };

  return { data: updated };
};

/** DELETE /v1/threads/:id */
export const DELETE = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Thread id is required" };

  await threads.delete(id as string);
  return { status: 204 };
};

/** POST /v1/threads/:id/archive */
export const POST = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const threads = createThreadHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Thread id is required" };

  const body = await context.request.body as Record<string, unknown>;
  const result = await threads.archive(
    id as string,
    (body.summary as string) ?? "",
  );

  return { data: result };
};
