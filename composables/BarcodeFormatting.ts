export const barcodeFormats = {
  UPC_A: 12,
  UPC_E: 6,
  QR_CODE: 8,
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

  for (const [key, value] of Object.entries(barcodeFormats)) {
    if (value === newResult.length) {
      format = key as keyof typeof barcodeFormats;
    }
  }
  if (!format || undefined) {
    alert("Invalid barcode format");
    return;
  }

  return format;
}
