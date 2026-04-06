import type { Context, Data } from "oxian-js/types";
import { createGraphHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/graph/nodes/:id/related */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Node id is required" };

  const url = new URL(context.request.url);
  const depth = url.searchParams.get("depth");

  return {
    data: await graph.findRelated(id as string, {
      depth: depth ? Number(depth) : undefined,
    }),
  };
};
