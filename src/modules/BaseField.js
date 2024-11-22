export class BaseField {
  constructor({
    id,
    label,
    type,
    value = "",
    validation = {},
    visible = true,
    conditional = null,
  }) {
    this.id = id;
    this.label = label;
    this.type = type;
    this.value = value;
    this.validation = validation;
    this.visible = visible;
    this.conditional = conditional;
  }
}
