<template>
  <VCol cols="12">
    <VOverlay v-model="overlay">
      <!-- This is the scanner for barcodes/qr codes. Camera automatically turns off when the overlay disappears. Currently set to qr and ean 13 codes -->
      <QrcodeStream
        class="border-lg border-success border-opacity-100 mt-2"
        :formats="[
          'aztec',
          'code_128',
          'code_39',
          'code_93',
          'codabar',
          'databar',
          'databar_expanded',
          'data_matrix',
          'dx_film_edge',
          'ean_13',
          'ean_8',
          'itf',
          'maxi_code',
          'micro_qr_code',
          'pdf417',
          'qr_code',
          'rm_qr_code',
          'upc_a',
          'upc_e',
          'linear_codes',
          'matrix_codes',
          'unknown',
        ]"
        @detect="onDetect"
        :track="paintBoundingBox"
        @error="onError"
        :paused="paused"
      >
        <VBtn
          @click="overlay = false"
          class="mt-0 position-absolute right-0 rounded-xl opacity-80"
        >
          Close</VBtn
        ></QrcodeStream
      >
      <!-- Check whether it does recognise the other formats-->
    </VOverlay>
  </VCol>
</template>
