<script setup lang="ts">
import { VTextField } from "vuetify/components";

const props = defineProps<{
  finalResults: { BarNumber: string; format: string }[];
  txtFieldCheck: string;
}>();

const emit = defineEmits<{
  (e: "checkField", payload: string): void;
  (e: "barcodeSubmit", payload: { BarNumber: string; format: string }): void;
}>();

// ------------------------- CONST ---------------------------
const txtFieldCheck = ref("");
const barcodeFormats = {
  UPC_A: 12,
  UPC_E: 6,
  QR_CODE: 8,
  EAN_13: 13,
  EAN_8: 8,
  CODE_39: 39,
  CODE_93: 93,
  CODE_128: 128,
  CODABAR: 16,
  ITF: 14,
  GS1: 17,
};

watch(txtFieldCheck, (newVal) => {
  emit("checkField", newVal);
});

// --------------------Check barcode format ------------------------
function checkBarcodeFormat(newResult: string) {
  let format: keyof typeof barcodeFormats | undefined;

  for (const [key, value] of Object.entries(barcodeFormats)) {
    if (value === newResult.length) {
      format = key as keyof typeof barcodeFormats;
    }
  }
  if (!format || undefined) {
    alert("Invalid barcode format");
    return;
  }

  return format;
}

//--------------------- Barcode scanner submit ----------------------

function barcodeSubmit(barScan: string) {
  for (const existingBarcode of props.finalResults) {
    if (existingBarcode.BarNumber === barScan) {
      alert("Barcode already added");
      return;
    }
  }
  const format = checkBarcodeFormat(barScan);
  if (!format) {
    return;
  }
  if (format) {
    emit("barcodeSubmit", {
      BarNumber: barScan,
      format: format,
    });

    console.log(txtFieldCheck.value);
  }
}
// -------------------Clear all input fields -------------------
function clearAll() {
  console.log(txtFieldCheck.value);
  txtFieldCheck.value = "";
}
</script>

<template>
  <VCol cols="12" class="text-center">
    <p class="text-h7">Enter details</p>
  </VCol>
  <VCol cols="12">
    <VForm @submit.prevent="barcodeSubmit(txtFieldCheck)">
      <VTextField
        class="mt-8"
        variant="solo"
        label="Barcode Number"
        v-model="txtFieldCheck"
        clearable
        @click:clear="clearAll"
      ></VTextField>
    </VForm>
  </VCol>

  <VCol cols="12" class="mb-8 text-center">
    <VBtn
      size="small"
      class="mx-2"
      color="green"
      @click="barcodeSubmit(txtFieldCheck)"
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
