import type { FastifyInstance } from 'fastify';
import type { AnalysisController } from '@presentation/http/controllers/analysis-controller';
import { createAnalysisSchema } from '@presentation/http/schemas/analysis-schema';

export async function analysisRoutes(app: FastifyInstance, controller: AnalysisController) {
  app.post(
    '/analyses',
    {
      schema: createAnalysisSchema
    },
    controller.create.bind(controller)
  );
}
