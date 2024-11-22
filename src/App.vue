<template>
  <div v-if="isSubmitSuccesfull" class="alert">Submission succesfull !</div>
  <form
    :class="{ 'form-margin-update': isSubmitSuccesfull }"
    @submit.prevent="submitForm"
  >
    <div v-for="field in formFields" :key="field.id">
      <div v-if="field.visible">
        <div v-if="field.type === 'text'" class="form-group">
          <label :for="field.id">{{ field.label }}</label>
          <input
            v-model="field.value"
            :id="field.id"
            type="text"
            @blur="validateField(field)"
          />
          <span v-if="field.error" class="error">{{ field.error }}</span>
        </div>
        <div v-if="field.type === 'number'" class="form-group">
          <label :for="field.id">{{ field.label }}</label>
          <input
            v-model.number="field.value"
            :id="field.id"
            type="number"
            :min="field.validation?.min"
            @blur="validateField(field)"
          />
          <span v-if="field.error" class="error">{{ field.error }}</span>
        </div>
        <div v-if="field.type === 'checkbox'">
          <label :for="field.id">
            <input
              v-model="field.checked"
              :id="field.id"
              type="checkbox"
              @change="handleConditionalLogic"
            />
            {{ field.label }}
          </label>
        </div>
        <div v-if="field.type === 'dropdown'" class="form-group">
          <label :for="field.id">{{ field.label }}</label>
          <select
            v-model="field.value"
            :id="field.id"
            @change="validateField(field)"
          >
            <option
              v-for="option in field.options"
              :key="option"
              :value="option"
            >
              {{ option }}
            </option>
          </select>
          <span v-if="field.error" class="error">{{ field.error }}</span>
        </div>
      </div>
    </div>
    <button type="submit">Submit</button>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from "vue";
import { TextField } from "@/modules/TextFields";
import { NumberField } from "@/modules/NumberField";
import { CheckboxField } from "@/modules/CheckboxField";
import { DropdownField } from "@/modules/DropdownField";
import jsonSchema from "@/jsonSchema/jsonSchema.json";

const schema = ref([]);
const formFields = ref([]);
const isSubmitSuccesfull = ref(false);
const emailRegex = /^[\w.-]+@[a-zA-Z\d.-]+\.[a-zA-Z]{2,}$/;

const loadSchema = () => {
  schema.value = jsonSchema;
};

const generateFields = () => {
  formFields.value = schema.value.map((field) => {
    switch (field.type) {
      case "text":
        return new TextField(field);
      case "number":
        return new NumberField(field);
      case "checkbox":
        return new CheckboxField(field);
      case "dropdown":
        return new DropdownField(field);
      default:
        return null;
    }
  });
};

onMounted(() => {
  loadSchema();
  generateFields();
  handleConditionalLogic();
});

const handleConditionalLogic = () => {
  formFields.value.forEach((field) => {
    if (field.conditional) {
      const conditionField = formFields.value.find(
        (f) => f.id === field.conditional.field
      );
      field.visible =
        conditionField &&
        (conditionField.checked === field.conditional.value ||
          conditionField.value === field.conditional.value);
    }
  });
};

const validateField = (field) => {
  if (field.validation?.required && !field.value) {
    field.error = `${field.label} is required`;
  } else {
    field.error = "";
  }

  if (field.id === "email" && field.validation?.pattern && field.value) {
    const isValidEmail = emailRegex.test(field.value);
    field.error = isValidEmail ? "" : "Please enter a valid email address";
  }
};

watch(
  () => formFields.value.map((field) => field.value),
  handleConditionalLogic,
  { deep: true }
);

const submitForm = () => {
  const formData = {};
  formFields.value.forEach((field) => {
    if (field.type === "checkbox") {
      formData[field.id] = field.checked;
    } else {
      formData[field.id] = field.value;
    }
    validateField(field);
  });
  const fieldsWithErrors = formFields.value.filter((field) => field.error);

  if (fieldsWithErrors.length === 0) {
    isSubmitSuccesfull.value = true;
    setTimeout(() => {
      isSubmitSuccesfull.value = false;
    }, 2000);
    console.log("Form Data:", formData);
  } else {
    isSubmitSuccesfull.value = false;
  }
};
</script>

<style scoped>
.form-group {
  margin-bottom: 15px;
}
.error {
  color: red;
  font-size: 12px;
}
</style>
