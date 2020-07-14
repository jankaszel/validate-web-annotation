const test = require('tape')
const validateAnnotation = require('./')

const basicAnnotation = {
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "id": "http://example.org/anno1",
  "type": "Annotation",
  "body": "http://example.org/post1",
  "target": "http://example.com/page1"
}

test('basic annotation', (t) => {
  t.plan(1)
  t.equal(validateAnnotation(basicAnnotation), true)
})