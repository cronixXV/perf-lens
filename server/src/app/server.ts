import Fastify from 'fastify';

import { analysisController } from '@app/container';
import { analysisRoutes } from '@presentation/http/routes/analysis-routes';

const app = Fastify({
  logger: true
});

app.get('/health', async () => {
  return {
    status: 'ok'
  };
});

const start = async () => {
  await analysisRoutes(app, analysisController);

  await app.listen({
    port: 3000,
    host: '0.0.0.0'
  });
};

start();
