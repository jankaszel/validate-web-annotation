const { Suite } = require('benchmark')
const validateAnnotationSchema = require('./schema')

const batchSize = 100
const basicAnnotation = {
  '@context': 'http://www.w3.org/ns/anno.jsonld',
  id: 'http://example.org/anno1',
  type: 'Annotation',
  target: 'http://example.com/page1',
}
const batch = [...Array(batchSize).map(() => basicAnnotation)]

const suite = new Suite(`Validate batches of ${batchSize} annotations`)
suite
  .add('validateAnnotationSchema', () =>
    batch.forEach((annotation) => validateAnnotationSchema(annotation))
  )
  .on('complete', function () {
    console.log(`Benchmarking results:
${JSON.stringify(this.filter('fastest'), null, 2)}`)
  })

suite.run({ async: true })
