/** Decode, orient, centre-crop and resize locally so preview and DOCX share pixels. */
export async function prepareResumePhoto(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png'].includes(file.type)) throw new Error('Choose a JPEG or PNG image.');
  if (file.size > 1024 * 1024) throw new Error('Choose a photo under 1 MB to keep your document small.');
  const url = URL.createObjectURL(file);
  try {
    const image = new Image();
    image.src = url;
    await image.decode();
    if (!image.naturalWidth || !image.naturalHeight || image.naturalWidth * image.naturalHeight > 25_000_000) throw new Error('Choose a smaller image, up to 25 megapixels.');
    const side = Math.min(image.naturalWidth, image.naturalHeight);
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 512;
    const context = canvas.getContext('2d');
    if (!context) throw new Error('This browser could not prepare the image. Try another image or leave the photo out.');
    context.fillStyle = '#ffffff';
    context.fillRect(0, 0, 512, 512);
    context.drawImage(image, (image.naturalWidth - side) / 2, (image.naturalHeight - side) / 2, side, side, 0, 0, 512, 512);
    return canvas.toDataURL('image/jpeg', 0.88);
  } catch (error) {
    if (error instanceof Error && error.name === 'EncodingError') throw new Error('This image could not be read. Your existing photo has not been changed.');
    throw error;
  } finally { URL.revokeObjectURL(url); }
}
