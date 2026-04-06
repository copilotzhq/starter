import type { Context, Data } from "oxian-js/types";
import { createGraphHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/graph/nodes/:id/edges */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) throw { status: 400, message: "Node id is required" };

  const url = new URL(context.request.url);
  const direction = url.searchParams.get("direction");
  const types = url.searchParams.getAll("type").filter(Boolean);

  return {
    data: await graph.getEdges(id as string, {
      direction:
        direction === "in" || direction === "out" || direction === "both"
          ? direction
          : undefined,
      types: types.length > 0 ? types : undefined,
    }),
  };
};
