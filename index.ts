import getCopilotzInstance from "@/lib/copilotz.ts";

if (import.meta.main) {

  const copilotz = await getCopilotzInstance;

  const session = copilotz.start({
    content: "Olá!",
    sender: { type: "user", name: "User" },
  });

  await session.closed;
  await copilotz.shutdown();
}
