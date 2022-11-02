import { fastifyTRPCPlugin } from '@trpc/server/adapters/fastify';
import fastify from 'fastify';
import { appRouter } from '@splashorg/domain';

const PORT = process.env.PORT ? parseInt(process.env.PORT, 10) : 3000;

const server = fastify({
  maxParamLength: 5000,
});
server.register(fastifyTRPCPlugin, {
  prefix: '/trpc',
  trpcOptions: { router: appRouter },
});
(async () => {
  try {
    await server.listen({ port: PORT });
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
})();
