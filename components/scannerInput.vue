<script setup lang="ts">
const emit = defineEmits<{
  (e: "barcodeSubmit", payload: { BarNumber: string; format: string }): void;
}>();

interface BarcodeResult {
  BarNumber: string;
  format: string;
}
const props = defineProps<{
  finalResults: BarcodeResult[];
  txtFieldCheck: string;
}>();

const barcodeScanInput = ref("");
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

function logKey(event: KeyboardEvent) {
  if (props.txtFieldCheck.length) {
    barcodeScanInput.value = "";
    console.log("Text Field: " + props.txtFieldCheck);

    return;
  }

  if (event.key === "Backspace") {
    barcodeScanInput.value = barcodeScanInput.value.slice(0, -1);
    return;
  }
  if (event.key === "Enter" && !barcodeScanInput.value.length) {
    return;
  }

  if (
    (event.key === "Enter" &&
      barcodeScanInput.value.length &&
      !props.txtFieldCheck.length) ||
    props.txtFieldCheck == null
  ) {
    barcodeSubmit(barcodeScanInput.value);
    barcodeScanInput.value = "";
    return;
  }

  if (
    event.key === "Enter" &&
    !barcodeScanInput.value.length &&
    !props.txtFieldCheck.length
  ) {
    alert("No Barcode Detected");
    return;
  }

  // if (event.key === undefined) {
  //   return;
  // }
  console.log("Barcode Scan: " + barcodeScanInput.value);
  barcodeScanInput.value += event.key;
}

// -------------------------ONMOUNTED START (Pls don't judge) -------------------------

onMounted(() => {
  window.addEventListener("keyup", logKey);
});

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
    alert("Submitted: " + barScan + ". Format: " + format);
  }
}
</script>

<template>
  <VCol cols="12" class="text-center mt-12">
    <p class="text-h7">Please scan</p>
  </VCol>
</template>
