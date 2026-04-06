import type { Context, Data } from "oxian-js/types";
import { createGraphHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/graph/nodes/:id */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Node id is required" };

  const node = await graph.getNodeById(id as string);
  if (!node) throw { status: 404, message: "Node not found" };

  return { data: node };
};

/** PATCH /v1/graph/nodes/:id */
export const PATCH = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Node id is required" };

  const body = await context.request.body as Record<string, unknown>;
  const updated = await graph.updateNode(
    id as string,
    body as Parameters<ReturnType<typeof createGraphHandlers>["updateNode"]>[1],
  );

  if (!updated) throw { status: 404, message: "Node not found" };
  return { data: updated };
};

/** DELETE /v1/graph/nodes/:id */
export const DELETE = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Node id is required" };

  await graph.deleteNode(id as string);
  return { status: 204 };
};
