import type { Context, Data } from "oxian-js/types";
import { createGraphHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/graph/namespaces/:namespace/nodes */
export const GET = async (
  data: Data & { namespace?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const graph = createGraphHandlers(copilotz);
  const namespace = context.request.pathParams?.namespace ?? data.namespace;

  if (!namespace) throw { status: 400, message: "Namespace is required" };

  const url = new URL(context.request.url);
  const type = url.searchParams.get("type") ?? undefined;

  return {
    data: await graph.listNodes(namespace as string, { type }),
  };
};
