export function base64ToFile(base64: string, defaultFilename = "upload") {
  const arr = base64.split(",");
  const mimeMatch = arr[0].match(/:(.*?);/);

  if (!mimeMatch) {
    throw new Error("Invalid Base64 string");
  }

  const mime = mimeMatch[1]; // e.g. "image/png"
  const extension = mime.split("/")[1]; // png, jpg, jpeg, webp

  const bstr = atob(arr[1]);
  let n = bstr.length;
  const u8arr = new Uint8Array(n);

  while (n--) {
    u8arr[n] = bstr.charCodeAt(n);
  }

  return new File([u8arr], `${defaultFilename}.${extension}`, { type: mime });
}
