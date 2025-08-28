<script setup lang="ts">
// -------------------------- IMPORTS--------------------------
import {
  QrcodeStream,
  type BarcodeFormat,
  type DetectedBarcode,
  type EmittedError,
} from "vue-qrcode-reader";
import { VTextField } from "vuetify/components";
import { ref, onMounted } from "vue";

// ------------------------- CONST ---------------------------
const barcodeScanInput = ref("");
const txtFieldInput = ref("");
const finalResult = ref<{ BarNumber: string; format: string }[]>([]);
const overlay = ref(false);
const errorMessage = ref("");
const paused = ref(false);
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

// -------------------------ERROR HANDLING START -------------------------
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
  systemAlert(error.message);
}

// -------------------------DETECTION START -------------------------
function onDetect(result: DetectedBarcode[]) {
  paused.value = true;
  const newBarcode = result[0];
  setTimeout(() => {
    for (const existingBarcode of finalResult.value) {
      if (existingBarcode.BarNumber === newBarcode.rawValue.toString()) {
        overlay.value = false;
        paused.value = false;
        alert("Barcode already added");
        return;
      }
    }
    finalResult.value.push({
      BarNumber: newBarcode.rawValue,
      format: newBarcode.format,
    });

    overlay.value = false;
    paused.value = false;

    cameraScanSubmit(newBarcode);
  }, 1000);
}

// -----------------------Submitted Camera Scan ---------------------
function cameraScanSubmit(newResults: any) {
  alert("Barcode: " + newResults.rawValue + "\nFormat: " + newResults.format);
}

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

// -------------------------KEYBOARD INPUT START -------------------------
function logKey(event: KeyboardEvent) {
  if (
    event.key === "Enter" &&
    !barcodeScanInput.value.length &&
    !txtFieldInput.value.length
  ) {
    alert("No Barcode Detected");
    return;
  }

  if (event.key === "Enter" && !txtFieldInput.value.length) {
    barcodeSubmit(barcodeScanInput.value);
    barcodeScanInput.value = "";
    return;
  }
  if (event.key === "Enter" && !barcodeScanInput.value.length) {
    barcodeSubmit(txtFieldInput.value);
    return;
  }

  if (txtFieldInput.value.length) {
    barcodeScanInput.value = "";
    return;
  }

  if (event.key === "Backspace") {
    barcodeScanInput.value = barcodeScanInput.value.slice(0, -1);
    return;
  }
  barcodeScanInput.value += event.key;
}

// -------------------Alert for the camera error -------------------
function systemAlert(message: string) {
  overlay.value = false;
  alert("Error: " + message);
}

// -------------------Clear all input fields -------------------
function clearAll() {
  barcodeScanInput.value = "";
  txtFieldInput.value = "";
  finalResult.value = [];
}

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
  for (const existingBarcode of finalResult.value) {
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
    finalResult.value.push({
      BarNumber: barScan,
      format: format,
    });
    alert(
      "Submitted: " +
        finalResult.value[finalResult.value.length - 1].BarNumber +
        ". Format: " +
        finalResult.value[finalResult.value.length - 1].format
    );
    console.log(finalResult.value);
    console.log(txtFieldInput.value);
    console.log(barcodeScanInput.value);
    return;
  }
}

// -------------------------ONMOUNTED START (Pls don't judge) -------------------------
onMounted(() => {
  document.addEventListener("keydown", logKey);
});
</script>

<!-- IMPORTANT: Plan is to have a manual input field for the user to either type in or let the scanner automatically fill it.
Depending on the scanner, Zebra devices might need to use DataWedge to ensure data is being correctly entered
Otherwise https://github.com/gruhn/vue-qrcode-reader?tab=readme-ov-file will be used for the barcode scanning for the user to enter through the camera-->

<template>
  <!-- This is where we want the scan with camera and possibly the manual input button as well -->

  <VApp>
    <VAppBar location="top" color="orange-darken-3">
      <template v-slot:prepend>
        <VAppBarNavIcon></VAppBarNavIcon>
      </template>

      <template v-slot:append>
        <VBtn
          @click="overlay = !overlay"
          size="small"
          variant="elevated"
          class="mr-4"
          color="black"
        >
          Use Camera
        </VBtn>
      </template>
    </VAppBar>
    <!-------------------------------------------------------------->

    <!-- This is where we want the main content to be. So where the product data is displayed before search has to be pressed (possibly having them chose what format it is for it to be automatic/delay check) -->
    <VMain>
      <VRow>
        <VCol cols="12" class="text-center">
          <VDivider class="my-7"> OR</VDivider>
        </VCol>
        <txtInput />

        <VCol cols="12">
          <VDivider class="my-12" v-if="finalResult.length"
            >CURRENT LIST</VDivider
          >

          <VCol cols="12">
            <p
              v-for="scannedItems in finalResult"
              :key="scannedItems.BarNumber"
              class="text-center"
            >
              Barcode Number: {{ scannedItems.BarNumber }} <br />
              Format: {{ scannedItems.format }} <br />
              <br />
            </p>
          </VCol>
        </VCol>
      </VRow>
    </VMain>
  </VApp>
</template>
