/** Centre-crop a JPEG/PNG in DrawingML, matching CSS object-fit: cover. */
export function photoCropXml(dataUrl: string): string {
  try {
    const bytes = Uint8Array.from(atob(dataUrl.split(',')[1] ?? ''), (char) => char.charCodeAt(0));
    const view = new DataView(bytes.buffer);
    let width = 0, height = 0;
    if (bytes.length >= 24 && view.getUint32(0) === 0x89504e47) {
      width = view.getUint32(16); height = view.getUint32(20);
    } else if (bytes[0] === 0xff && bytes[1] === 0xd8) {
      for (let offset = 2; offset + 9 < bytes.length;) {
        if (bytes[offset] !== 0xff) break;
        const marker = bytes[offset + 1];
        if (marker === 0xd9 || marker === 0xda) break;
        const size = view.getUint16(offset + 2);
        if (size < 2) break;
        if ([0xc0, 0xc1, 0xc2, 0xc3, 0xc5, 0xc6, 0xc7, 0xc9, 0xca, 0xcb, 0xcd, 0xce, 0xcf].includes(marker)) {
          height = view.getUint16(offset + 5); width = view.getUint16(offset + 7); break;
        }
        offset += 2 + size;
      }
    }
    if (!width || !height || width === height) return '';
    const crop = Math.round((1 - Math.min(width, height) / Math.max(width, height)) * 50000);
    return width > height ? `<a:srcRect l="${crop}" r="${crop}"/>` : `<a:srcRect t="${crop}" b="${crop}"/>`;
  } catch { return ''; }
}
