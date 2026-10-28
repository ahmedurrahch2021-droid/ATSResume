const WHATSAPP_NUMBER = '8801748755209';

/** Owner-confirmed contact details. A WhatsApp link does not send a message. */
export const SERVICE_CONTACT = {
  email: 'ahmedur.rahch2021@gmail.com',
  whatsappDisplay: `+${WHATSAPP_NUMBER}`,
  whatsappUrl: `https://wa.me/${WHATSAPP_NUMBER}`,
} as const;

export const REPLY_POLICY = 'We reply to email and WhatsApp messages within 24 hours.';
export const DELIVERY_POLICY = 'This is a reply policy, not a document-delivery deadline. Delivery dates are agreed before payment.';
