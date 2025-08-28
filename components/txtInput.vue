<template>
  <VCol cols="12" class="text-center">
    <p class="text-h7">Enter details</p>
  </VCol>
  <VCol cols="12">
    <VTextField
      class="mt-8"
      variant="solo"
      label="Barcode Number"
      v-model="txtFieldInput"
    ></VTextField>
  </VCol>

  <VCol cols="12" class="mb-8 text-center">
    <VBtn
      size="small"
      class="mx-2"
      color="green"
      @click="barcodeSubmit(txtFieldInput)"
    >
      Search
    </VBtn>
    <VBtn
      size="small"
      @click="clearAll()"
      class="mx-2 text-center"
      color="grey"
    >
      Clear
    </VBtn>
  </VCol>
</template>
