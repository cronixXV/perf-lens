import 'dotenv/config';
import Fastify from 'fastify';
import cors from '@fastify/cors';

import { analysisController } from '@app/container';
import { getAnalysisErrorStatus } from '@presentation/http/errors/get-analysis-error-status';
import { analysisRoutes } from '@presentation/http/routes/analysis-routes';
import { AnalysisError } from '@domain/analysis/errors/analysis-error';

const app = Fastify({
  logger: true
});

app.setErrorHandler((error, request, reply) => {
  if (error instanceof AnalysisError) {
    request.log.warn(
      {
        code: error.code,
        err: error
      },
      'Analysis error'
    );

    return reply.code(getAnalysisErrorStatus(error.code)).send({
      code: error.code,
      message: error.message,
      retryable: error.retryable
    });
  }

  request.log.error(
    {
      err: error,
      method: request.method,
      url: request.url
    },
    'Unhandled server error'
  );

  return reply.code(500).send({
    code: 'INTERNAL_SERVER_ERROR',
    message: 'An unexpected server error occurred',
    retryable: false
  });
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
