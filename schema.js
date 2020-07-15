const Ajv = require('ajv')
const formats = require('./formats')
const annotationSchema = require('./wadm-schema.json')

const ajv = new Ajv()
ajv.addFormat('iri', formats.iri)
const validate = ajv.compile(annotationSchema)

module.exports = function validateAnnotationSchema (annotation) {
  return validate(annotation)
}
