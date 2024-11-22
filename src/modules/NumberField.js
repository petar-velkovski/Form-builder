// NumberField.js
import { BaseField } from "./BaseField";

export class NumberField extends BaseField {
  constructor(options) {
    super({ ...options, type: "number" });
  }
}
