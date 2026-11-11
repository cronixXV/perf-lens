import type { FastifyInstance } from 'fastify';
import type { AnalysisController } from '@presentation/http/controllers/analysis-controller';
import {
  createAnalysisSchema,
  getAnalysisByIdSchema
} from '@presentation/http/schemas/analysis-schema';

export async function analysisRoutes(app: FastifyInstance, controller: AnalysisController) {
  app.post('/analyses', { schema: createAnalysisSchema }, controller.create.bind(controller));
  app.get('/analyses', controller.getAll.bind(controller));
  app.get('/analyses/:id', { schema: getAnalysisByIdSchema }, controller.getById.bind(controller));
  app.get('/analyses/compare', controller.compare.bind(controller));
}
