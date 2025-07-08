import jsQR from 'jsqr';

export async function scanQRCodeFromImage(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = function () {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        if (!ctx) return reject('Canvas context error');
        ctx.drawImage(img, 0, 0, img.width, img.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const code = jsQR(imageData.data, imageData.width, imageData.height);
        if (code) resolve(code.data);
        else reject('QR code not found');
      };
      img.src = reader.result as string;
    };
    reader.onerror = () => reject('File read error');
    reader.readAsDataURL(file);
  });
}
