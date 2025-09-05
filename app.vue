<script setup lang="ts">
import type { BarcodeResult } from "./types/BarcodeModule";
// -------------------------- CONST--------------------------
const finalResult = ref<BarcodeResult[]>([]);

const toggles = ref([
  { name: "Scanner", showBoolean: false },
  { name: "Camera", showBoolean: false },
  { name: "Input", showBoolean: false },
]);

function toggleSwitch(toggle: string) {
  toggles.value.forEach((element) => {
    if (element.name === toggle) {
      return;
    }
    element.showBoolean = false;
  });
}
</script>

<template>
  <VApp>
    <VAppBar location="top" color="orange-darken-3">
      <template v-slot:prepend>
        <VAppBarNavIcon></VAppBarNavIcon>
      </template>
    </VAppBar>

    <!-- Main Content: All components are rendered depending on the array of the 3 choices -->
    <VMain>
      <VRow>
        <VCol v-for="button in toggles" cols="4" class="d-flex justify-center">
          <VSwitch
            color="primary"
            v-model="button.showBoolean"
            :label="button.name"
            :trueValue="true"
            :falseValue="false"
            :disabled="button.showBoolean"
            @update:modelValue="toggleSwitch(button.name)"
          >
          </VSwitch>
        </VCol>
      </VRow>
      <!-- Switches to choose what to render. Default everything is off first -->
      <VRow>
        <VCol cols="12">
          <Barcode
            :moduleShow="
              toggles.find(t => t.showBoolean)?.name as 'Scanner' | 'Camera' | 'Input' | undefined
            "
            @barcodeSubmit="
              finalResult.push({
                barNumber: $event.barNumber,
                format: $event.format,
              })
            "
          />
        </VCol>

        <!-- List items scanned -->
        <VCol cols="12">
          <VDivider class="my-12" v-if="finalResult.length"
            >CURRENT LIST</VDivider
          >

          <VCol cols="12">
            <p
              v-for="scannedItems in finalResult"
              :key="scannedItems.barNumber"
              class="text-center"
            >
              Barcode Number: {{ scannedItems.barNumber }} <br />
              Format: {{ scannedItems.format }} <br />
              <br />
            </p>
          </VCol>
        </VCol>
      </VRow>
    </VMain>
  </VApp>
</template>
