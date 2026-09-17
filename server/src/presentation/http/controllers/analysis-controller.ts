import type { FastifyReply, FastifyRequest } from 'fastify';
import type { CreateAnalysis } from '@application/analysis/create-analysis';

interface ICreateAnalysisRequest {
  Body: {
    url: string;
  };
}

export class AnalysisController {
  constructor(private readonly createAnalysis: CreateAnalysis) {}

  async create(request: FastifyRequest<ICreateAnalysisRequest>, reply: FastifyReply) {
    const result = await this.createAnalysis.execute(request.body.url);

    return reply.send(result);
  }
}
