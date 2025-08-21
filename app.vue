<script setup lang="ts">
import {
  QrcodeStream,
  type DetectedBarcode,
  type EmittedError,
} from "vue-qrcode-reader";
import { VTextField } from "vuetify/components";

function onDetect(result: DetectedBarcode[]) {
  console.log("Code detected:", result);
  const newBarcode = result[0];
  console.log("Raw value:", newBarcode.rawValue);
  return newBarcode.rawValue;
}

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
}

const result = ref<DetectedBarcode[]>([]);
const stringResult = ref("");
const disabledButtons = ref(false);
const overlay = ref(false);
</script>

<!-- Plan is to have a manual input field for the user to either type in or let the scanner automatically fill it.
Depending on the scanner, Zebra devices might need to use DataWedge to ensure data is being correctly entered
Otherwise https://github.com/gruhn/vue-qrcode-reader?tab=readme-ov-file will be used for the barcode scanning for the user to enter through the camera-->

<template>
  <NuxtLayout>
    <VApp>
      <VAppBar location="top">
        <template v-slot:prepend>
          <VAppBarNavIcon></VAppBarNavIcon>
        </template>

        <VAppBarTitle>Barcode scanner</VAppBarTitle>

        <template v-slot:append>
          <VBtn icon="mdi-magnify"></VBtn>

          <VBtn icon="mdi-dots-vertical"></VBtn>
          <VBtn @click="overlay = !overlay"> Scan with Camera </VBtn>
        </template>
      </VAppBar>

      <VMain>
        <VRow>
          <VCol cols="fill">
            <VTextField
              class="mt-8"
              variant="solo"
              :disabled="disabledButtons"
              label="Consignment Number"
              v-model="stringResult"
            ></VTextField>
            <!-- potentially change the v-model to the raw value of the detectedBarcode somehow -->
          </VCol>

          <!-- <VCol cols="auto" align-self="center">
            <VBtn
              @click="disabledButtons = !disabledButtons"
              class="mb-5"
              size="small"
            >
              Manual Input
            </VBtn>
          </VCol> -->

          <VCol cols="12">
            <VBtn size="small" location="center"> Search </VBtn>
          </VCol>
          <VOverlay v-model="overlay">
            <VBtn @click="overlay = false" location="top left"> Close </VBtn>
            <QrcodeStream
              :formats="['qr_code', 'code_128']"
              @detect="onDetect"
              @error="onError"
              v-model="result"
            ></QrcodeStream>
            <!-- Check whether it does recognise the other formats except for qr codes-->
          </VOverlay>
        </VRow>
      </VMain>
    </VApp>
  </NuxtLayout>
</template>
