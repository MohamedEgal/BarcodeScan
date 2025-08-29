<script setup lang="ts">
const props = defineProps<{
  finalResults: { BarNumber: string; format: string }[];
  txtFieldCheck: string;
}>();

// ------------------------- CONST ---------------------------
const barcodeScanInput = ref("");
const txtFieldCheck = ref(props.txtFieldCheck);
const txtFieldInput = ref(txtFieldCheck);
const txtResult = ref(props.finalResults);
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
  for (const existingBarcode of txtResult.value) {
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
    txtResult.value.push({
      BarNumber: barScan,
      format: format,
    });
    alert(
      "Submitted: " +
        txtResult.value[txtResult.value.length - 1].BarNumber +
        ". Format: " +
        txtResult.value[txtResult.value.length - 1].format
    );
    console.log(txtResult.value);
    console.log(txtFieldInput.value);
    console.log(barcodeScanInput.value);
    return {
      BarNumber: txtResult.value[txtResult.value.length - 1].BarNumber,
      format: txtResult.value[txtResult.value.length - 1].format,
    };
  }
}
// -------------------Clear all input fields -------------------
function clearAll() {
  barcodeScanInput.value = "";
  txtFieldInput.value = "";
  txtResult.value = [];
}
</script>

<template>
  <VCol cols="12" class="text-center">
    <p class="text-h7">Enter details</p>
  </VCol>
  <VCol cols="12">
    <VForm @submit.prevent="$emit('inpFieldCheck', txtFieldCheck)">
      <VTextField
        class="mt-8"
        variant="solo"
        label="Barcode Number"
        v-model="txtFieldInput"
      ></VTextField>
    </VForm>
  </VCol>

  <VCol cols="12" class="mb-8 text-center">
    <VBtn
      size="small"
      class="mx-2"
      color="green"
      @click="barcodeSubmit(txtFieldInput)"
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
