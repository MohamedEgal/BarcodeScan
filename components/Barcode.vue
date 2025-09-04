<script setup lang="ts">
defineProps<{
  cameraShow: boolean;
  scannerShow: boolean;
  textFieldShow: boolean;
  finalResults: { BarNumber: string; format: string }[];
}>();

const emit = defineEmits<{
  (e: "barcodeSubmit", payload: { BarNumber: string; format: string }): void;
}>();

const txtFieldCheck = ref("");
</script>

<template>
  <CameraInput
    v-if="cameraShow"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :final-results="finalResults"
  />
  <VCol cols="12" class="text-center" v-if="cameraShow && textFieldShow">
    <VDivider class="my-7"> OR</VDivider>
  </VCol>

  <TxtInput
    v-if="textFieldShow"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    @check-field="txtFieldCheck = $event"
    :final-results="finalResults"
    :txt-field-check="txtFieldCheck"
  />
  <VCol
    cols="12"
    class="text-center"
    v-if="(scannerShow && textFieldShow) || (scannerShow && cameraShow)"
  >
    <VDivider class="my-7"> OR</VDivider>
  </VCol>

  <ScannerInput
    v-if="scannerShow"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :final-results="finalResults"
    :txt-field-check="txtFieldCheck"
  />
</template>
