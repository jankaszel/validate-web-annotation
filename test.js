const test = require('tape')
const validateAnnotation = require('./schema')

const bodyIri = 'http://example.org/post1'
const textualBody = {
  type: 'TextualBody',
  value: 'Comment text',
  format: 'text/plain',
}

const targetIri = 'http://example.com/page1'
const targetResource = {
  id: 'http://example.gov/patent1.pdf',
  format: 'application/pdf',
  language: ['en', 'ar'],
  textDirection: 'ltr',
  processingLanguage: 'en',
}

const context = 'http://www.w3.org/ns/anno.jsonld'
const basicAnnotation = {
  '@context': context,
  id: 'http://example.org/anno1',
  type: 'Annotation',
  target: targetIri,
}

test('basic annotation', (t) => {
  const failures = [
    {},
    {
      ...basicAnnotation,
      '@context': 'foobar',
    },
    {
      ...basicAnnotation,
      '@context': ['foo', 'bar'],
    },
    {
      ...basicAnnotation,
      type: 'foobar',
    },
    {
      ...basicAnnotation,
      target: 'foobar',
    },
  ]

  t.plan(2 + failures.length)
  t.ok(validateAnnotation(basicAnnotation))
  t.ok(
    validateAnnotation({
      ...basicAnnotation,
      '@context': ['http://example.com/some-schema.jsonld', context],
    })
  )

  for (const failure of failures) {
    t.notOk(validateAnnotation(failures))
  }
})

test('basic annotation without id', (t) => {
  t.plan(4)
  const withoutId = { ...basicAnnotation }
  delete withoutId.id

  t.notOk(validateAnnotation(withoutId), 'default fails without id')
  t.ok(
    validateAnnotation(withoutId, { optionalId: true }),
    'opts.optionalId passes without id'
  )
  t.ok(
    validateAnnotation(basicAnnotation, { optionalId: true }),
    'opts.optionalId passes with id'
  )
  t.notOk(
    validateAnnotation(
      {
        ...withoutId,
        type: 'foobar',
      },
      { optionalId: true }
    ),
    'opts.optionalId fails without id and wrong type'
  )
})

test('textual body', (t) => {
  t.plan(4)
  t.ok(
    validateAnnotation({ ...basicAnnotation, bodyValue: 'foobar' }),
    'only bodyValue'
  )
  t.ok(
    validateAnnotation({ ...basicAnnotation, body: bodyIri }),
    'only body IRI'
  )
  t.ok(
    validateAnnotation({ ...basicAnnotation, body: textualBody }),
    'only body textual body'
  )
  t.notOk(
    validateAnnotation({
      ...basicAnnotation,
      body: bodyIri,
      bodyValue: 'foobar',
    }),
    'both bodyValue and body IRI'
  )
})

test('external resources', (t) => {
  t.plan(3)
  t.ok(
    validateAnnotation(
      {
        ...basicAnnotation,
        body: {
          id: 'http://example.org/analysis1.mp3',
          format: 'audio/mpeg',
          language: 'fr',
        },
        target: {
          id: 'http://example.gov/patent1.pdf',
          format: 'application/pdf',
          language: ['en', 'ar'],
          textDirection: 'ltr',
          processingLanguage: 'en',
        },
      },
      'both external body and target'
    )
  )
  t.notOk(
    validateAnnotation(
      {
        ...basicAnnotation,
        target: {
          format: 'application/pdf',
          language: ['en', 'ar'],
          textDirection: 'ltr',
          processingLanguage: 'en',
        },
      },
      'external target with missing ID'
    )
  )
  t.notOk(
    validateAnnotation(
      {
        ...basicAnnotation,
        body: {
          format: 'application/pdf',
          language: ['en', 'ar'],
          textDirection: 'ltr',
          processingLanguage: 'en',
        },
      },
      'external body with missing ID'
    )
  )
})

test('body and target cardinality', (t) => {
  t.plan(2)
  t.ok(
    validateAnnotation(
      {
        ...basicAnnotation,
        body: [bodyIri, textualBody],
      },
      'both iri and textual body'
    )
  )
  t.ok(
    validateAnnotation({
      ...basicAnnotation,
      target: [targetIri, targetResource, 'http://example.com/post2'],
    })
  )
})

test('body choice', (t) => {
  t.plan(2)
  t.ok(
    validateAnnotation({
      ...basicAnnotation,
      body: {
        type: 'Choice',
        items: [bodyIri, textualBody],
      },
    }),
    'choice on IRI or textual body'
  )
  t.notOk(
    validateAnnotation({
      ...basicAnnotation,
      body: {
        type: 'Choice',
      },
    }),
    'choice missing items'
  )
})
