import type { Data, Context } from "oxian-js/types";
import { listPublicAgents } from "copilotz";
import type { Dependencies } from "@/api/dependencies.ts";

export const GET = async (
    _data: Data,
    context: Context & { dependencies: Dependencies },
) => {
    const { copilotz } = context.dependencies;
    const agents = listPublicAgents(copilotz.config.agents ?? []);
    return { data: agents };
};
