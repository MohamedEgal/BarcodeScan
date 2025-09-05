<script setup lang="ts">
// Define Props
defineProps<{
  moduleShow: "Scanner" | "Camera" | "Input" | undefined;
  finalResults: { barNumber: string; format: string }[];
}>();

// Define emit
const emit = defineEmits<{
  (e: "barcodeSubmit", payload: { barNumber: string; format: string }): void;
}>();

// Const for the text field (Need barcode scanner to read this in case both need to be functional)
const textField = ref("");
</script>

<template>
  <!-- Error -->
  <p class="text-center" v-if="!moduleShow">
    Error: moduleShow variable not configured
  </p>

  <!-- Camera Module -->
  <CameraInput
    v-if="moduleShow === 'Camera'"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :final-results="finalResults"
  />

  <!-- Text Input module -->
  <TxtInput
    v-if="moduleShow === 'Input'"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    @check-field="textField = $event"
    :final-results="finalResults"
    :text-field="textField"
  />

  <!-- Scanner module -->
  <ScannerInput
    v-if="moduleShow === 'Scanner'"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :final-results="finalResults"
    :text-field="textField"
  />
</template>
