<script setup lang="ts">
// Imports
import {
  QrcodeStream,
  type BarcodeFormat,
  type DetectedBarcode,
  type EmittedError,
} from "vue-qrcode-reader";
import type { BarcodeResult } from "~/types/BarcodeModule";

// If the camera scanning errors
function onError(error: EmittedError) {
  if (error.name === "NotAllowedError") {
    console.log("Camera access denied");
  } else if (error.name === "NotFoundError") {
    console.log("No suitable camera device installed");
  } else if (error.name === "NotSupportedError") {
    console.log("Page is not served over HTTPS (or localhost)");
  } else if (error.name === "NotReadableError") {
    console.log("Camera is already in use");
  } else if (error.name === "OverconstrainedError") {
    console.log("Requested front camera is not available");
  } else if (error.name === "StreamApiNotSupportedError") {
    console.log("Browser seems to be lacking features");
  }
  errorMessage.value = error.message;
  alert(error.message);
  overlay.value = false;
}

// Emit
const emit = defineEmits(["barcodeSubmit"]);
// Const
const errorMessage = ref("");
const overlay = ref(false);
const paused = ref(false);
const formatsCamera: BarcodeFormat[] = [
  "aztec",
  "code_128",
  "code_39",
  "code_93",
  "codabar",
  "databar",
  "databar_expanded",
  "data_matrix",
  "dx_film_edge",
  "ean_13",
  "ean_8",
  "itf",
  "maxi_code",
  "micro_qr_code",
  "pdf417",
  "qr_code",
  "rm_qr_code",
  "upc_a",
  "upc_e",
  "linear_codes",
  "matrix_codes",
  "unknown",
];

// ------------------------PaintBoxThingy for Camera -----------------------
function paintBoundingBox(detectedCodes: any, ctx: CanvasRenderingContext2D) {
  for (const detectedCode of detectedCodes) {
    const {
      boundingBox: { x, y, width, height },
    } = detectedCode;

    ctx.lineWidth = 2;
    ctx.strokeStyle = "#007bff";
    ctx.strokeRect(x, y, width, height);
  }
}

// -------------------------Ondetect (when the camera has detected the barcode) -------------------------
function onDetect(result: DetectedBarcode[]) {
  paused.value = true;
  const newBarcode = result[0];

  emit("barcodeSubmit", {
    barNumber: newBarcode.rawValue,
    format: newBarcode.format.toUpperCase(),
  });

  overlay.value = false;
  paused.value = false;
  alert(
    "Barcode: " +
      result[result.length - 1].rawValue +
      "\nFormat: " +
      result[result.length - 1].format
  );
  return;
}
</script>

<template>
  <!-- Button to activate the camera scan -->
  <VCol cols="12" class="text-center mt-10 mx-2">
    <VBtn
      @click="overlay = !overlay"
      size="small"
      variant="elevated"
      class="mr-4"
      color="black"
    >
      Use Camera
    </VBtn>
  </VCol>

  <!-- Overlay with the camera module -->
  <VCol cols="12">
    <VOverlay v-model="overlay">
      <!-- This is the scanner for barcodes/qr codes. Camera automatically turns off when the overlay disappears. Currently set to qr and ean 13 codes -->
      <QrcodeStream
        class="border-lg border-success border-opacity-100 mt-2"
        :formats="formatsCamera"
        @detect="onDetect"
        :track="paintBoundingBox"
        @error="onError"
        :paused="paused"
      >
        <VBtn
          @click="overlay = false"
          class="mt-0 position-absolute right-0 rounded-xl opacity-80"
        >
          Close</VBtn
        ></QrcodeStream
      >
    </VOverlay>
  </VCol>
</template>
