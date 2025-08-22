<script setup lang="ts">
// -------------------------- CONSTANTS START --------------------------
import { QrcodeStream, type EmittedError } from "vue-qrcode-reader";
import { VTextField } from "vuetify/components";
import { ref, onMounted } from "vue";
const keyPressResult = ref("");
const cameraResults = ref("");
const txtFieldResult = ref("");
const disabledButtons = ref(true);
const overlay = ref(false);
const errorMessage = ref("");
const paused = ref(false);

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
  setTimeout(() => {
    const newBarcode = result[0];
    console.log("Raw value:", newBarcode.rawValue);
    cameraResults.value = newBarcode.rawValue;
    overlay.value = false;
  }, 1000);
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
  if (txtFieldResult.value) {
    return;
  }
  if (event.key === "Enter") {
    keyPressResult.value += "";
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
  cameraResults.value = "";
  txtFieldResult.value = "";
}

// -------------------Manual Input button clears all text fields -------------------
function activateInput() {
  txtFieldResult.value = "";
  keyPressResult.value = "";
  cameraResults.value = "";
  disabledButtons.value = !disabledButtons.value;
  return disabledButtons.value;
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
  <NuxtLayout>
    <VApp>
      <VAppBar location="top">
        <template v-slot:prepend>
          <VAppBarNavIcon></VAppBarNavIcon>
        </template>

        <template v-slot:append>
          <VBtn
            @click="activateInput()"
            size="small"
            variant="elevated"
            class="mr-2"
          >
            Manual Input
          </VBtn>
          <VBtn
            @click="overlay = !overlay"
            size="small"
            variant="elevated"
            class="mr-9"
          >
            Scan with Camera
          </VBtn>
        </template>
      </VAppBar>
      <!-------------------------------------------------------------->

      <!-- This is where we want the main content to be. So where the product data is displayed before search has to be pressed (possibly having them chose what format it is for it to be automatic/delay check) -->
      <VMain>
        <VRow>
          <VCol cols="12">
            <p v-if="cameraResults">Camera results: {{ cameraResults }}</p>
            <p
              v-if="
                keyPressResult && txtFieldResult.length === 0 && disabledButtons
              "
            >
              Product ID: {{ keyPressResult }}
            </p>
          </VCol>
          <VCol cols="fill">
            <VTextField
              v-if="!disabledButtons"
              class="mt-8"
              focused
              variant="solo"
              label="Product Number"
              v-model="txtFieldResult"
            ></VTextField>
            <!-- potentially change the v-model to the raw value of the detectedBarcode somehow -->
          </VCol>

          <VCol cols="12">
            <VBtn size="small" location="center"> Search </VBtn>
            <VBtn size="small" location="center" @click="clearAll()">
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
              v-model="cameraResults"
            ></QrcodeStream>
            <!-- Check whether it does recognise the other formats except for qr codes-->
          </VOverlay>
        </VRow>
      </VMain>
    </VApp>
  </NuxtLayout>
</template>
