import Ajv from "ajv";
import addFormats from "ajv-formats";
import assert from "node:assert/strict";

const ajv = new Ajv({ allErrors: true, allowUnionTypes: true });
addFormats(ajv);

export function validateSchema(schema: object, body: unknown): void {
  const validate = ajv.compile(schema);
  const isValid = validate(body);
  assert.ok(isValid, `Schema validation failed: ${ajv.errorsText(validate.errors)}`);
}
