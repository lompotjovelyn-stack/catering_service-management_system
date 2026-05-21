const QRCode = require("qrcode");

/**
 * Generate QR code as data URL
 * @param {string} data - Data to encode in QR code
 * @returns {Promise<string>} - Data URL of QR code image
 */
async function generateQRCode(data) {
  try {
    const qrCodeDataURL = await QRCode.toDataURL(data, {
      errorCorrectionLevel: "H",
      type: "image/png",
      quality: 0.95,
      margin: 1,
      width: 300,
    });
    return qrCodeDataURL;
  } catch (error) {
    console.error("Error generating QR code:", error);
    throw error;
  }
}

/**
 * Generate payment QR code
 * @param {number} paymentId - Payment ID
 * @param {number} amount - Payment amount
 * @param {string} currency - Currency code (default: PHP)
 * @returns {Promise<string>} - Data URL of QR code image
 */
async function generatePaymentQRCode(paymentId, amount, currency = "PHP") {
  const paymentData = `PAYMENT|ID:${paymentId}|AMOUNT:${amount}|CURRENCY:${currency}`;
  return generateQRCode(paymentData);
}

module.exports = {
  generateQRCode,
  generatePaymentQRCode,
};
