import type { Context, Data } from "oxian-js/types";
import type { Dependencies } from "@/api/dependencies.ts";

const handler = async (
  data: Data & { path?: string[] },
  context: Context & { dependencies: Dependencies },
) => {
  
  // Extract context properties to avoid conflicts with copilotz context
  const { request, response, dependencies, ...restContext } = context;
  // Extract dependencies
  const { copilotz } = dependencies;

  if (data?.path?.[0] === "providers") {
    data.path[0] = "channels";
  }

  const segments = Array.isArray(data.path) ? data.path : [];
  const [resource, ...path] = segments;

  if (!resource) throw { status: 400, message: "Resource is required" };

  const url = new URL(request.url);
  const query = Object.fromEntries(url.searchParams);
  const method = request.method as "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

  let sse: ReturnType<typeof response.sse> | undefined;

  const callback = (event: unknown) => {
    if (!sse) {
      sse = response.sse();
    }
    const eventName =
      typeof event === "object" && event !== null && "type" in event
        ? String((event as { type: unknown }).type)
        : "message";
    sse.send(event, { event: eventName });
  };

  try {
    const result = await copilotz.app.handle({
      resource,
      method,
      path,
      query,
      body: request.body,
      headers: Object.fromEntries(request.headers.entries()),
      rawBody: request.rawBody,
      callback,
      context: restContext,
    });

    if (sse) {
      sse.close();
      return;
    }

    // Uniform envelope: HTTP body is always `{ data, pageInfo? }`.
    const body: Record<string, unknown> = { data: result.data };
    if (result.pageInfo !== undefined) body.pageInfo = result.pageInfo;
    response.send(body, { status: result.status ?? 200 });
  } catch (err: unknown) {
    if (sse) sse.close();
    console.error("[api/v1/[...path]] handler error", {
      resource,
      method,
      path,
      error: err,
    });
    if (
      typeof err === "object" &&
      err !== null &&
      "status" in err &&
      typeof (err as { status?: unknown }).status === "number"
    ) {
      throw err;
    }
    const errorMessage = err instanceof Error
      ? err.message
      : typeof err === "string"
      ? err
      : "Internal server error";
    throw {
      status: 500,
      message: errorMessage,
      ...(Deno.env.get("ENV") === "DEV"
        ? {
          details: {
            resource,
            method,
            path,
            error: err,
          },
        }
        : {}),
    };
  }
};

export const GET = handler;
export const POST = handler;
export const PUT = handler;
export const PATCH = handler;
export const DELETE = handler;
