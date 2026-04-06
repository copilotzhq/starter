import type { MessagePayload, Copilotz } from "copilotz";

if (import.meta.main) {
    const dependenciesFactory = await import('./dependencies.ts').then(m => m.default);
    const { copilotz } = await dependenciesFactory({});

    const session = (copilotz as Copilotz).start({
        content: 'Hello!',
        sender: { type: 'user', name: 'User' },
        // thread: { participants: ['copilotz'] },
        target: 'assistant',
    } as MessagePayload);

    await session.closed;
    await (copilotz as Copilotz).shutdown();
}
