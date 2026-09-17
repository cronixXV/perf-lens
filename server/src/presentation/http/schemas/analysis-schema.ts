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
