const test = require('tape')
const validateAnnotation = require('./')

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

const basicAnnotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'http://example.org/anno1',
  type: 'Annotation',
  target: targetIri,
}

test('basic annotation', (t) => {
  t.plan(1)
  t.ok(validateAnnotation(basicAnnotation))
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
