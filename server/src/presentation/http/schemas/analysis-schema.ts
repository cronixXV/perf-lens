export const createAnalysisSchema = {
  body: {
    type: 'object',
    required: ['url'],
    additionalProperties: false,
    properties: {
      url: {
        type: 'string',
        format: 'uri'
      }
    }
  }
} as const;

export const getAnalysisByIdSchema = {
  params: {
    type: 'object',
    required: ['id'],
    additionalProperties: false,
    properties: {
      id: {
        type: 'string',
        format: 'uuid'
      }
    }
  }
} as const;
