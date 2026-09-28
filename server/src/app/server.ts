import Fastify from 'fastify';
import cors from '@fastify/cors';

import { analysisController } from '@app/container';
import { analysisRoutes } from '@presentation/http/routes/analysis-routes';

const app = Fastify({
  logger: true
});

const start = async () => {
  await app.register(cors, {
    origin: 'http://localhost:5173'
  });

  app.get('/health', async () => {
    return {
      status: 'ok'
    };
  });

  await analysisRoutes(app, analysisController);

  await app.listen({
    port: 3000,
    host: '0.0.0.0'
  });
};

start();
