import type { Data, Context } from "oxian-js/types";
import { createCollectionHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/collections/:collection - List items in a collection. */
export const GET = async (
    data: Data & { collection?: string },
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    const collectionName = context.request.pathParams?.collection ?? data.collection;

    if (!collectionName) throw { status: 400, message: "Collection name is required" };

    const url = new URL(context.request.url);
    const limit = url.searchParams.get("limit");
    const offset = url.searchParams.get("offset");
    const namespace = url.searchParams.get("namespace") ?? undefined;
    const search = url.searchParams.get("q");

    if (search) {
        return {
            data: await collections.search(collectionName as string, search, {
                namespace,
                limit: limit ? Number(limit) : undefined,
            }),
        };
    }

    return {
        data: await collections.list(collectionName as string, {
            namespace,
            limit: limit ? Number(limit) : undefined,
            offset: offset ? Number(offset) : undefined,
        }),
    };
};

/** POST /v1/collections/:collection - Create an item. */
export const POST = async (
    data: Data & { collection?: string },
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const collections = createCollectionHandlers(copilotz);
    const collectionName = context.request.pathParams?.collection ?? data.collection;

    if (!collectionName) throw { status: 400, message: "Collection name is required" };

    const body = await context.request.body as Record<string, unknown>;
    const namespace = (context.request.query?.namespace as string) ?? undefined;

    const result = await collections.create(collectionName as string, body, { namespace });
    return { status: 201, body: result };
};
