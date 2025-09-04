<script setup lang="ts">
// -------------------------- CONST--------------------------

const finalResult = ref<{ BarNumber: string; format: string }[]>([]);
const scannerShow = ref(true);
const cameraShow = ref(true);
const textFieldShow = ref(true);
</script>

<!-- IMPORTANT: Plan is to have a manual input field for the user to either type in or let the scanner automatically fill it.
Depending on the scanner, Zebra devices might need to use DataWedge to ensure data is being correctly entered
Otherwise https://github.com/gruhn/vue-qrcode-reader?tab=readme-ov-file will be used for the barcode scanning for the user to enter through the camera-->

<template>
  <VApp>
    <VAppBar location="top" color="orange-darken-3">
      <template v-slot:prepend>
        <VAppBarNavIcon></VAppBarNavIcon>
      </template>
    </VAppBar>

    <!-- Main Content: All components are rendered depending on the three variables: scannerShow, cameraShow and textFieldShow -->
    <VMain>
      <VRow>
        <Barcode
          :scannerShow="scannerShow"
          :cameraShow="cameraShow"
          :textFieldShow="textFieldShow"
          :finalResults="finalResult"
          @barcodeSubmit="
            finalResult.push({
              BarNumber: $event.BarNumber,
              format: $event.format,
            })
          "
        />

        <!-- List items scanned -->
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
