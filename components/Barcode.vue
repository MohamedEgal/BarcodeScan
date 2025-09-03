<script setup lang="ts">
// -------------------------- idk--------------------------
defineProps<{
  cameraCheck: boolean;
  scannerCheck: boolean;
  finalResults: { BarNumber: string; format: string }[];
}>();

const emit = defineEmits<{
  (e: "barcodeSubmit", payload: { BarNumber: string; format: string }): void;
  (e: "overlayScreen", payload: boolean): void;
}>();

const txtFieldCheck = ref("");
</script>

<template>
  <CameraInput
    v-if="cameraCheck"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :final-results="finalResults"
  />
  <VCol cols="12" class="text-center" v-if="cameraCheck">
    <VDivider class="my-7"> OR</VDivider>
  </VCol>

  <TxtInput
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    @check-field="txtFieldCheck = $event"
    :final-results="finalResults"
    :txt-field-check="txtFieldCheck"
  />
  <VCol cols="12" class="text-center" v-if="scannerCheck">
    <VDivider class="my-7"> OR</VDivider>
  </VCol>

  <ScannerInput
    v-if="scannerCheck"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    @check-field="txtFieldCheck = $event"
    :final-results="finalResults"
    :txt-field-check="txtFieldCheck"
  />
</template>
