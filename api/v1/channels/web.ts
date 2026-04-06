import type { Context } from "oxian-js/types";
import type { MessagePayload, StreamEvent } from "copilotz";
import type { Dependencies } from "@/api/dependencies.ts";

export const POST = async (
    data: MessagePayload,
    context: Context & { dependencies: Dependencies },
) => {
    const { response } = context;
    const sse = response.sse();
    const { copilotz } = context.dependencies;

    if (!copilotz) throw new Error("Copilotz instance not found");

    const controller = await copilotz.run(data);

    for await (const event of controller.events as AsyncIterable<StreamEvent>) {
        switch (event.type) {
            case "NEW_MESSAGE":
                sse.send(event, { event: "MESSAGE" });
                break;
            case "ASSET_CREATED":
                sse.send(event, { event: "ASSET_CREATED" });
                break;
            case "ASSET_ERROR":
                sse.send(event, { event: "ASSET_ERROR" });
                break;
            case "TOKEN":
                sse.send(event, { event: "TOKEN" });
                break;
            case "TOOL_CALL":
                sse.send(event, { event: "TOOL_CALL" });
                break;
        }
    }

    sse.close();
    return { status: "ok" };
};
