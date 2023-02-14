import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@mwelwa/server';
 
// Notice the <AppRouter> generic here.
export const trpc = createTRPCProxyClient<AppRouter>({
  links: [
    httpBatchLink({
      url: 'http://localhost:8080/trpc',
    }),
  ],
});