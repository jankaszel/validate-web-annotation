const Ajv = require('ajv')
const formats = require('./formats')
const createSchema = require('./wadm-schema.js')

const ajv = new Ajv()
ajv.addFormat('iri', formats.iri)
const validate = ajv.compile(createSchema())
const validateOptionalId = ajv.compile(createSchema({ optionalId: true }))

module.exports = function validateAnnotationSchema (annotation, opts = {}) {
  const optionalId = opts.optionalId || false
  return optionalId ? validateOptionalId:webkitCancelAnimationFramehannotation) : validate(annotation)
}
