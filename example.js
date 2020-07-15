const assert = require('assert')
const validateAnnotation = require('./')

const annotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'http://example.org/anno1',
  type: 'Annotation',
  body: {
    type: 'TextualBody',
    value: 'Comment text',
    format: 'text/plain',
  },
  target: 'http://example.com/page1',
}
assert(validateAnnotation(annotation), 'Annotation should be valid')
