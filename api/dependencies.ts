
import { withApp } from "copilotz/server";
import getCopilotzInstance from "@/lib/copilotz.ts";

const dependencies = async (deps: Record<string, unknown>) => {
  
  const copilotz = await getCopilotzInstance

  const copilotzApp = withApp(copilotz);

  return { ...deps, copilotz: copilotzApp };
};

export type Dependencies = Awaited<ReturnType<typeof dependencies>>;

export default dependencies;
