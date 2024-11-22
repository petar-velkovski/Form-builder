// DropdownField.js
import { BaseField } from "./BaseField";

export class DropdownField extends BaseField {
  constructor(options) {
    super({ ...options, type: "dropdown" });
    this.options = options.options || [];
  }
}
