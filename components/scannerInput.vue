<script setup lang="ts">
// Imports
import type { BarcodeResult } from "~/types/BarcodeModule";
import { checkBarcodeFormat } from "#imports";

// Emits
const emit = defineEmits({
  barcodeSubmit: (result: BarcodeResult) => false,
});

// Const
const barcodeScanInput = ref("");

// Capture keypresses and handle the logic of it
function logKey(event: KeyboardEvent) {
  if (event.key === "Backspace") {
    barcodeScanInput.value = barcodeScanInput.value.slice(0, -1);
    return;
  }

  if (event.key === "Enter" && barcodeScanInput.value.length) {
    barcodeSubmit(barcodeScanInput.value);
    barcodeScanInput.value = "";
    return;
  }

  barcodeScanInput.value += event.key;
}

// -------------------------ONMOUNTED/ONUNMOUNTED (Pls don't judge) -------------------------

onMounted(() => {
  window.addEventListener("keyup", logKey);
});
onUnmounted(() => {
  window.removeEventListener("keyup", logKey);
});

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
</script>

<template>
  <!-- No need to explain -->
  <VCol cols="12" class="text-center mt-12">
    <p class="text-h7">Please scan</p>
  </VCol>
</template>
