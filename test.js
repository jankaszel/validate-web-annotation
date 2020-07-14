const test = require('tape')
const validateAnnotation = require('./')

const bodyIri = 'http://example.org/post1'
const basicAnnotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'http://example.org/anno1',
  type: 'Annotation',
  target: 'http://example.com/page1',
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
    validateAnnotation({
      ...basicAnnotation,
      body: {
        type: 'TextualBody',
        value: 'Comment text',
        format: 'text/plain',
      },
    }),
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
