// CheckboxField.js
import { BaseField } from "./BaseField";

export class CheckboxField extends BaseField {
  constructor(options) {
    super({ ...options, type: "checkbox" });
    this.checked = options.value || false;
  }
}
