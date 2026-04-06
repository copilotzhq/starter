import type { Data, Context } from "oxian-js/types";
import { createCollectionHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/collections/:collection/:id */
export const GET = async (
    data: Data & { collection?: string; id?: string },
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    const collectionName = context.request.pathParams?.collection ?? data.collection;
    const id = context.request.pathParams?.id ?? data.id;

    if (!collectionName || !id) throw { status: 400, message: "Collection name and id are required" };

    const namespace = (context.request.query?.namespace as string) ?? undefined;
    const item = await collections.getById(collectionName as string, id as string, { namespace });
    if (!item) throw { status: 404, message: "Item not found" };

    return { data: item };
};

/** PUT /v1/collections/:collection/:id */
export const PUT = async (
    data: Data & { collection?: string; id?: string },
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    const collectionName = context.request.pathParams?.collection ?? data.collection;
    const id = context.request.pathParams?.id ?? data.id;

    if (!collectionName || !id) throw { status: 400, message: "Collection name and id are required" };

    const body = await context.request.body as Record<string, unknown>;
    const namespace = (context.request.query?.namespace as string) ?? undefined;

    const result = await collections.update(collectionName as string, id as string, body, { namespace });
    return { data: result };
};

/** DELETE /v1/collections/:collection/:id */
export const DELETE = async (
    data: Data & { collection?: string; id?: string },
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    const collectionName = context.request.pathParams?.collection ?? data.collection;
    const id = context.request.pathParams?.id ?? data.id;

    if (!collectionName || !id) throw { status: 400, message: "Collection name and id are required" };

    const namespace = (context.request.query?.namespace as string) ?? undefined;
    await collections.delete(collectionName as string, id as string, { namespace });

    return { status: 204 };
};
