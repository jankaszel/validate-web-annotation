const valueOrArray = (wrappedType) => ({
  oneOf: [
    wrappedType,
    {
      type: 'array',
      items: wrappedType,
    },
  ],
})

module.exports = (opts = {}) => ({
  $schema: 'http://json-schema.org/schema#',
  type: 'object',
  properties: {
    '@context': {
      oneOf: [
        { const: 'http://www.w3.org/ns/anno.jsonld' },
        {
          type: 'array',
          items: {
            type: 'string',
            format: 'iri',
          },
          contains: { const: 'http://www.w3.org/ns/anno.jsonld' },
        },
      ],
    },
    type: { const: 'Annotation' },
    id: {
      type: 'string',
      format: 'iri',
    },
    body: {
      oneOf: [
        { $ref: '#/definitions/bodyChoice' },
        { $ref: '#/definitions/body' },
        {
          type: 'array',
          items: {
            $ref: '#/definitions/body',
          },
        },
      ],
    },
    bodyValue: { type: 'string' },
    target: valueOrArray({ $ref: '#/definitions/target' }),
    creator: valueOrArray({ $ref: '#/definitions/agent' }),
    created: {
      type: 'string',
      format: 'date',
    },
    generator: valueOrArray({ $ref: '#/definitions/agent' }),
    generated: {
      type: 'string',
      format: 'date',
    },
    modified: {
      type: 'string',
      format: 'date',
    },
  },
  required: [
    '@context',
    ...(opts.optionalId === true ? [] : ['id']),
    'type',
    'target',
  ],
  dependencies: {
    bodyValue: {
      not: {
        required: ['body'],
      },
    },
  },
  definitions: {
    body: {
      anyOf: [
        {
          type: 'string',
          format: 'iri',
        },
        { $ref: '#/definitions/textualBody' },
        { $ref: '#/definitions/externalResource' },
      ],
    },
    textualBody: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'iri',
        },
        type: { const: 'TextualBody' },
        value: { type: 'string' },
        format: { type: 'string' },
      },
      required: ['type', 'value'],
    },
    bodyChoice: {
      type: 'object',
      properties: {
        type: { const: 'Choice' },
        items: {
          type: 'array',
          items: { $ref: '#/definitions/body' },
        },
      },
      required: ['type', 'items'],
    },
    target: {
      anyOf: [
        {
          type: 'string',
          format: 'iri',
        },
        { $ref: '#/definitions/externalResource' },
      ],
    },
    externalResource: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'iri',
        },
        type: { $ref: '#/definitions/string-value-or-array' },
        format: { $ref: '#/definitions/string-value-or-array' },
        language: { $ref: '#/definitions/string-value-or-array' },
        processingLanguage: { type: 'string' },
        textDirection: {
          type: 'string',
          enum: ['ltr', 'rtl', 'auto'],
        },
      },
      required: ['id'],
    },
    agent: {
      oneOf: [
        {
          type: 'string',
          format: 'iri',
        },
        {
          type: 'object',
          properties: {
            id: {
              type: 'string',
              format: 'iri',
            },
            type: { $ref: '#/definitions/string-value-or-array' },
            name: { $ref: '#/definitions/string-value-or-array' },
            nickname: { $ref: '#/definitions/string-value-or-array' },
            email: { $ref: '#/definitions/string-value-or-array' },
            email_sha1: { $ref: '#/definitions/string-value-or-array' },
            homepage: {
              oneOf: [
                {
                  type: 'string',
                  format: 'iri',
                },
                {
                  type: 'array',
                  items: {
                    type: 'string',
                    format: 'iri',
                  },
                },
              ],
            },
          },
        },
      ],
    },
    'string-value-or-array': {
      oneOf: [
        { type: 'string' },
        {
          type: 'array',
          items: {
            type: 'string',
          },
        },
      ],
    },
  },
})
