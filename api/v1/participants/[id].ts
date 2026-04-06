import type { Context, Data } from "oxian-js/types";
import { createParticipantHandlers } from "copilotz/server";
import type { Dependencies } from "@/api/dependencies.ts";

/** GET /v1/participants/:id */
export const GET = async (
  data: Data & { id?: string },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const participants = createParticipantHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) {
    throw { status: 400, message: "Participant id is required" };
  }

  return {
    data: await participants.get(id as string),
  };
};

/** PUT /v1/participants/:id */
export const PUT = async (
  data: Data & { id?: string; replaceMemories?: string | boolean },
  context: Context & { dependencies: Dependencies },
) => {
  const { copilotz } = context.dependencies;
  const participants = createParticipantHandlers(copilotz);
  const id = context.request.pathParams?.id ?? data.id;

  if (!id) {
    throw { status: 400, message: "Participant id is required" };
  }

  const body = await context.request.body as Record<string, unknown>;
  if (!body || Object.keys(body).length === 0) {
    throw {
      status: 400,
      message: "Request body must contain participant data to update",
    };
  }

  const replaceMemories = data.replaceMemories ??
    context.request.query?.replaceMemories;

  return {
    data: await participants.update(id as string, body, {
      replaceKeys: replaceMemories === true || replaceMemories === "true"
        ? ["memories"]
        : [],
      participantType: "human",
    }),
  };
};
