<script setup lang="ts">
// Imports
import type { BarcodeResult } from "~/types/BarcodeModule";
import { checkBarcodeFormat } from "#imports";

// Props
const props = defineProps<{
  finalResults: readonly BarcodeResult[];
  textField: string;
}>();

// Emits
const emits = defineEmits({
  checkField: (input: string) => false,
  barcodeSubmit: (result: BarcodeResult) => false,
});

// ------------------------- CONST ---------------------------
const textField = ref("");

// watch(textField, (newVal) => {
//   emit("checkField", newVal);
// });

//!!! ^^^^ Put this back if textfield and scanner both runs at the same time

//--------------------- Barcode scanner submit ----------------------

function barcodeSubmit(barScan: string) {
  if (!barScan.length) {
    alert("No Barcode Detected");
    return;
  }
  for (const existingBarcode of props.finalResults) {
    if (existingBarcode.barNumber === barScan) {
      alert("Barcode already added");
      return;
    }
  }
  const format = checkBarcodeFormat(barScan);
  if (!format) {
    return;
  }
  if (format) {
    emits("barcodeSubmit", {
      barNumber: barScan,
      format: format,
    });
  }
}

// -------------------Clear input field -------------------
function clearAll() {
  textField.value = "";
}
</script>

<template>
  <!-- Form with text field -->
  <VCol cols="12" class="text-center">
    <p class="text-h7">Enter details</p>
  </VCol>
  <VCol cols="12">
    <VForm @submit.prevent="barcodeSubmit(textField)">
      <VTextField
        class="mt-8"
        variant="solo"
        label="Barcode Number"
        v-model="textField"
        clearable
        @click:clear="clearAll"
      ></VTextField>
    </VForm>
  </VCol>

  <!-- Buttons to search and clear -->
  <VCol cols="12" class="mb-8 text-center">
    <VBtn
      size="small"
      class="mx-2"
      color="green"
      @click="barcodeSubmit(textField)"
    >
      Search
    </VBtn>
    <VBtn
      size="small"
      @click="clearAll()"
      class="mx-2 text-center"
      color="grey"
    >
      Clear
    </VBtn>
  </VCol>
</template>
