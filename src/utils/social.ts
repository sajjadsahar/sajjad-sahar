/**
 * Social Links & Messaging utilities for Sajjad Sahar's Portfolio
 */

export const DEFAULT_FACEBOOK_URL = 'https://web.facebook.com/sajjad.sahar.942/';
export const DEFAULT_WHATSAPP_NUMBER = '03485039425';
export const DEFAULT_WHATSAPP_MESSAGE = 'Hello Sajjad, I visited your portfolio and would like to discuss a project.';

/**
 * Returns the international wa.me link for WhatsApp.
 * Converts 03485039425 to 923485039425 according to Pakistan international dialing format,
 * without the '+' sign as requested by the user, and attaches the pre-filled inquiry message.
 */
export const getWhatsAppLink = (
  phone: string = DEFAULT_WHATSAPP_NUMBER,
  message: string = DEFAULT_WHATSAPP_MESSAGE
): string => {
  const clean = (phone || '').replace(/[^0-9]/g, '');
  let intlDigits = clean;

  if (clean.startsWith('03')) {
    intlDigits = '92' + clean.slice(1);
  } else if (clean.startsWith('92')) {
    intlDigits = clean;
  } else if (clean.startsWith('3') && clean.length === 10) {
    intlDigits = '92' + clean;
  } else if (!clean) {
    intlDigits = '923485039425';
  }

  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${intlDigits}?text=${encodedMsg}`;
};

/**
 * Returns clean sanitized Facebook profile URL
 */
export const getFacebookUrl = (customUrl?: string): string => {
  if (!customUrl || customUrl.includes('placeholder') || customUrl === 'https://facebook.com/sajjadsahar') {
    return DEFAULT_FACEBOOK_URL;
  }
  return customUrl;
};
