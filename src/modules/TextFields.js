// TextField.js
import { BaseField } from "./BaseField";

export class TextField extends BaseField {
  constructor(options) {
    super({ ...options, type: "text" });
  }
}
