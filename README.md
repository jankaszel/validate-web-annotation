# Validate Web Annotation

This is a JavaScript library for validating a JSON object against the [Web Annotation Data Model](https://www.w3.org/TR/annotation-model/) schema.

`npm install validate-web-annotation`

## API

This library exposes a simple function for validating annotations:

```js
const validateAnnotation = require('validate-web-annotation')
const annotation = {
  "@context": "http://www.w3.org/ns/anno.jsonld",
  "id": "http://example.org/anno1",
  "type": "Annotation",
  // ...
}
const valid = validateAnnotation(annotation)
```

## License

MIT
