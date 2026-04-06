import type { Data, Context } from "oxian-js/types";
import { createCollectionHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/collections - List all registered collections. */
export const GET = async (
    _data: Data,
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    return { data: collections.listCollections() };
};
