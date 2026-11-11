import type { FastifyReply, FastifyRequest } from 'fastify';

import { getAnalysisErrorStatus } from '../errors/get-analysis-error-status';

import type { CreateAnalysis } from '@application/analysis/create-analysis';
import type { GetAnalysisHistory } from '@application/analysis/get-analysis-history';
import type { GetAnalysisById } from '@application/analysis/get-analysis-by-id';
import type { CompareAnalyses } from '@application/analysis/compare-analyses';
import { AnalysisError } from '@domain/analysis/errors/analysis-error';

interface ICreateAnalysisRequest {
  Body: {
    url: string;
  };
}

interface IGetAnalysisByIdRequest {
  Params: {
    id: string;
  };
}

interface ICompareAnalysesRequest {
  Querystring: {
    beforeId: string;
    afterId: string;
  };
}

export class AnalysisController {
  constructor(
    private readonly createAnalysis: CreateAnalysis,
    private readonly getAnalysisHistory: GetAnalysisHistory,
    private readonly getAnalysisById: GetAnalysisById,
    private readonly compareAnalyses: CompareAnalyses
  ) {}

  async create(request: FastifyRequest<ICreateAnalysisRequest>, reply: FastifyReply) {
    try {
      const result = await this.createAnalysis.execute(request.body.url);

      return reply.send(result);
    } catch (error) {
      if (error instanceof AnalysisError) {
        return reply.code(getAnalysisErrorStatus(error.code)).send({
          code: error.code,
          message: error.message,
          retryable: error.retryable
        });
      }

      throw error;
    }
  }

  async getAll(_request: FastifyRequest, reply: FastifyReply) {
    const result = await this.getAnalysisHistory.execute();

    return reply.send(result);
  }

  async getById(request: FastifyRequest<IGetAnalysisByIdRequest>, reply: FastifyReply) {
    const result = await this.getAnalysisById.execute(request.params.id);

    if (!result) {
      return reply.code(404).send({
        message: 'Analysis not found'
      });
    }

    return reply.send(result);
  }

  async compare(request: FastifyRequest<ICompareAnalysesRequest>, reply: FastifyReply) {
    const { beforeId, afterId } = request.query;

    const result = await this.compareAnalyses.execute(beforeId, afterId);

    if (!result) {
      return reply.code(404).send({
        message: 'One or both analyses not found'
      });
    }

    return reply.send(result);
  }
}
