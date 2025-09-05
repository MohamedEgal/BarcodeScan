export const barcodeFormats = {
  UPC_A: 12,
  UPC_E: 6,
  EAN_13: 13,
  EAN_8: 8,
  CODE_39: 39,
  CODE_93: 93,
  CODE_128: 128,
  CODABAR: 16,
  ITF: 14,
  GS1: 17,
};

// --------------------Check barcode format ------------------------
export function checkBarcodeFormat(newResult: string) {
  let format: keyof typeof barcodeFormats | undefined;

  format =
    (Object.entries(barcodeFormats).find(
      (value) => value[1] === newResult.length
    )?.[0] as keyof typeof barcodeFormats) ?? alert("Invalid barcode format");

  return format;
}
