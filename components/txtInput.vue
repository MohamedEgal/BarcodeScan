<script setup lang="ts">
// Imports
import type { BarcodeResult } from "~/types/BarcodeModule";
import { checkBarcodeFormat } from "#imports";

// Emits
const emit = defineEmits({
  barcodeSubmit: (result: BarcodeResult) => false,
});

// ------------------------- CONST ---------------------------
const textField = ref("");

//--------------------- Barcode scanner submit ----------------------

function barcodeSubmit(barScan: string) {
  if (!barScan.length) {
    alert("No Barcode Detected");
    return;
  }

  const format = checkBarcodeFormat(barScan);
  if (!format) {
    return;
  }
  if (format) {
    emit("barcodeSubmit", {
      barNumber: barScan,
      format: format,
    });
    alert("Submitted: " + barScan + ". Format: " + format);
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
