const valueOrArray = (wrappedType) => ({
  oneOf: [
    wrappedType,
    {
      type: 'array',
      items: wrappedType,
    },
  ],
})

const stringValueOrArray = valueOrArray({
  type: 'string',
})
const iriValueOrArray = valueOrArray({
  type: 'string',
  format: 'iri',
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
        { $ref: '#/definitions/specificResource' },
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
        { $ref: '#/definitions/specificResource' },
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
        type: stringValueOrArray,
        format: stringValueOrArray,
        language: stringValueOrArray,
        processingLanguage: { type: 'string' },
        textDirection: {
          type: 'string',
          enum: ['ltr', 'rtl', 'auto'],
        },
      },
      required: ['id'],
    },
    specificResource: {
      type: 'object',
      properties: {
        id: {
          type: 'string',
          format: 'iri',
        },
        type: { type: 'string' },
        source: {
          type: 'string',
          format: 'iri',
        },
        selector: {
          oneOf: [
            { type: 'string', format: 'iri' },
            { $ref: '#/definitions/selector' },
            { type: 'array', items: { $ref: '#/definitions/selector' } },
          ],
        },
      },
      required: ['source'],
    },
    selector: {
      type: 'object',
      properties: {
        type: { type: 'string' },
      },
      required: ['type'],
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
            type: stringValueOrArray,
            name: stringValueOrArray,
            nickname: stringValueOrArray,
            email: stringValueOrArray,
            email_sha1: stringValueOrArray,
            homepage: iriValueOrArray,
          },
        },
      ],
    },
  },
})
