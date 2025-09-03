<script setup lang="ts">
// -------------------------- IMPORTS--------------------------

const finalResult = ref<{ BarNumber: string; format: string }[]>([]);
const txtFieldCheck = ref("");
const scannerCheck = ref(true);
const cameraCheck = ref(true);

// -------------------------ONMOUNTED START (Pls don't judge) -------------------------
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
    </VAppBar>
    <!-------------------------------------------------------------->

    <!-- This is where we want the main content to be. So where the product data is displayed before search has to be pressed (possibly having them chose what format it is for it to be automatic/delay check) -->
    <VMain>
      <VRow>
        <Barcode
          :scannerCheck="scannerCheck"
          :cameraCheck="cameraCheck"
          :txt-field-check="txtFieldCheck"
          :finalResults="finalResult"
          ;
        />

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
