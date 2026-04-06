import type { Context, Data } from "oxian-js/types";
import { createGraphHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** POST /v1/graph/search */
export const POST = async (
  _data: Data,
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const body = await context.request.body as {
    query?: string;
    embedding?: number[];
    namespaces?: string[];
    nodeTypes?: string[];
    limit?: number;
    minSimilarity?: number;
  };

  return {
    data: await graph.search({
      query: body.query,
      embedding: body.embedding,
      namespaces: body.namespaces,
      nodeTypes: body.nodeTypes,
      limit: body.limit,
      minSimilarity: body.minSimilarity,
    }),
  };
};
