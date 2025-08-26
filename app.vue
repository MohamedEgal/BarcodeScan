<script setup lang="ts">
// -------------------------- IMPORTS--------------------------
import {
  QrcodeStream,
  type BarcodeFormat,
  type EmittedError,
} from "vue-qrcode-reader";
import { VTextField } from "vuetify/components";
import { ref, onMounted } from "vue";

// ------------------------- CONST ---------------------------
const keyPressResult = ref("");
const cameraResults = ref<{ rawValue: string; format: string }[]>([]);
const txtFieldResult = ref("");
const finalResult = ref("");
const overlay = ref(false);
const errorMessage = ref("");
const paused = ref(false);
const barcodeFormats = ref({
  "UPC-A": 12,
  "UPC-E": 6,
  QR_CODE: 8,
  EAN_13: 13,
  EAN_8: 8,
  CODE_39: 39,
  CODE_93: 93,
  CODE_128: 128,
  CODABAR: 16,
  ITF: 14,
  GS1: 17,
});

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
function onDetect(result: any[]) {
  console.log("Code detected:", result);
  paused.value = true;
  const newBarcode = result[0];
  setTimeout(() => {
    for (const existingBarcode of cameraResults.value) {
      if (existingBarcode.rawValue === newBarcode.rawValue) {
        overlay.value = false;
        paused.value = false;
        return;
      }
    }
    cameraResults.value.push({
      rawValue: newBarcode.rawValue,
      format: newBarcode.format,
    });

    overlay.value = false;
    paused.value = false;
  }, 1000);

  cameraScanSubmit(newBarcode);
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
async function logKey(event: KeyboardEvent) {
  if (event.key === "Enter" && !keyPressResult.value && !txtFieldResult.value) {
    alert("No Barcode Detected");
    return;
  } else if (event.key === "Enter" && !txtFieldResult.value) {
    barcodeSubmit(keyPressResult.value);
    keyPressResult.value = "";
    return;
  } else if (event.key === "Enter" && !keyPressResult.value) {
    barcodeSubmit(txtFieldResult.value);
    return;
  }

  if (txtFieldResult.value) {
    keyPressResult.value = "";
    return;
  }

  if (event.key === "Backspace") {
    keyPressResult.value = keyPressResult.value.slice(0, -1);
    return;
  }
  keyPressResult.value += event.key;
}

// -------------------Alert for the camera error -------------------
function systemAlert(message: string) {
  overlay.value = false;
  alert("Error: " + message);
}

// -------------------Clear all input fields -------------------
function clearAll() {
  keyPressResult.value = "";
  cameraResults.value = [];
  txtFieldResult.value = "";
}

// --------------------Check barcode format ------------------------
function checkBarcodeFormat(newResult: string) {
  let format: keyof typeof barcodeFormats.value | undefined;

  for (const [key, value] of Object.entries(barcodeFormats.value)) {
    if (value === newResult.length) {
      format = key as keyof typeof barcodeFormats.value;
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
  const format = checkBarcodeFormat(barScan);
  if (!format) {
    return;
  }
  finalResult.value = barScan;
  if (format) {
    alert("Submitted: " + barScan + ". Format: " + format);
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
  <NuxtLayout class="overflow-x-hidden">
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
      <VMain class="overflow-x-hidden">
        <VRow>
          <VCol cols="12" class="text-center mt-12">
            <p v-for="value in cameraResults" :key="value.rawValue">
              {{ value.rawValue }} & {{ value.format }}
            </p>
          </VCol>
          <VCol cols="12" class="text-center mt-12">
            <h4>PLEASE SCAN</h4>
          </VCol>
          <VCol cols="12" class="text-center"
            ><VDivider class="my-12"> OR</VDivider>
          </VCol>
          <VCol cols="12" class="text-center">
            <h4>Enter Details</h4>
          </VCol>
          <VCol cols="fill">
            <VTextField
              class="mt-8"
              variant="solo"
              label="Barcode Number"
              v-model="txtFieldResult"
            ></VTextField>
            <!-- potentially change the v-model to the raw value of the detectedBarcode somehow -->
          </VCol>

          <VCol cols="12" class="text-center">
            <VBtn
              size="small"
              class="mx-2"
              color="green"
              @click="barcodeSubmit(txtFieldResult)"
            >
              Search
            </VBtn>
            <VBtn size="small" @click="clearAll()" class="mx-2" color="grey">
              Clear
            </VBtn>
          </VCol>
          <VOverlay v-model="overlay">
            <VBtn @click="overlay = false" location="top left"> Close </VBtn>
            <!-- This is the scanner for barcodes/qr codes. Camera automatically turns off when the overlay disappears. Currently set to qr and ean 13 codes -->
            <QrcodeStream
              :formats="['qr_code', 'ean_13']"
              @detect="onDetect"
              :track="paintBoundingBox"
              @error="onError"
              :paused="paused"
            ></QrcodeStream>
            <!-- Check whether it does recognise the other formats except for qr codes-->
          </VOverlay>
        </VRow>
      </VMain>
    </VApp>
  </NuxtLayout>
</template>
