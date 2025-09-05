<script setup lang="ts">
import type { BarcodeResult } from "~/types/BarcodeModule";
// Define Props
defineProps<{
  moduleShow: "Scanner" | "Camera" | "Input" | undefined;
}>();

// Define emit
const emit = defineEmits({
  barcodeSubmit: (result: BarcodeResult) => false,
});

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
  />

  <!-- Text Input module -->
  <TxtInput
    v-if="moduleShow === 'Input'"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :text-field="textField"
  />

  <!-- Scanner module -->
  <ScannerInput
    v-if="moduleShow === 'Scanner'"
    @barcodeSubmit="emit('barcodeSubmit', $event)"
    :text-field="textField"
  />
</template>
