# Validating Web Annotations

A JavaScript library for validating JSON objects against the [Web Annotation Data Model (WADM)](https://www.w3.org/TR/annotation-model/) via [JSON Schema](https://json-schema.org).

`npm install validate-web-annotation`

This library is still under active development and only partially covers the WADM specification. While most general-purpose properties of an annotation are being properly validated (e.g., `id`, `target`, `body`), more specific properties such as `purpose` and `state` are missing validation. I intend this library to act rather efficient and general-purpose than covering the whole WADM specification, so I'll explicitly specify the validation coverage.

## API

This library exposes a simple function for validating annotations:

```js
// see ./example.js for a full example
const validateAnnotation = require("validate-web-annotation");
const annotation = {
  "@context": "http://www.w3.org/ns/anno.jsonld",
  id: "http://example.org/anno1",
  type: "Annotation",
  // ...
};
const valid = validateAnnotation(annotation);
```

## Benchmarks

In order to collect benchmarks on the schema-based validation approach, run the benchmarking suite (which uses [benchmark.js](https://benchmarkjs.com)) via `npm run bench`.

## License

MIT
