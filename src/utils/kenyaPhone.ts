export const MPESA_TILL_NUMBER = '1534251';
export const MPESA_TILL_NAME = 'TKESHTRADE PARTNERS';

export type KenyanNetwork = 'safaricom' | 'airtel' | 'telkom' | 'other';

/**
 * Identifies Kenyan mobile network operator based on prefix
 */
export const detectKenyanNetwork = (normalizedOrClean: string): { network: KenyanNetwork; name: string; brandColor: string } => {
  let cleaned = normalizedOrClean.replace(/\D/g, '');
  if (cleaned.startsWith('254')) cleaned = cleaned.slice(3);
  if (cleaned.startsWith('0')) cleaned = cleaned.slice(1);

  // Safaricom prefixes: 070X, 071X, 072X, 0740-0743, 0745-0746, 0748, 079X, 0110-0115
  if (
    /^(70|71|72|74[0-3]|74[5-6]|748|79|11[0-5])/.test(cleaned)
  ) {
    return { network: 'safaricom', name: 'Safaricom M-PESA', brandColor: '#10b981' };
  }

  // Airtel prefixes: 073X, 075X, 078X, 0100-0106
  if (
    /^(73|75|78|10[0-6])/.test(cleaned)
  ) {
    return { network: 'airtel', name: 'Airtel Money', brandColor: '#ef4444' };
  }

  // Telkom prefixes: 077X
  if (/^77/.test(cleaned)) {
    return { network: 'telkom', name: 'Telkom T-Kash', brandColor: '#f59e0b' };
  }

  return { network: 'safaricom', name: 'Safaricom M-PESA', brandColor: '#10b981' };
};

/**
 * Validates Kenyan registered phone number
 * Valid formats: 07XXXXXXXX, 01XXXXXXXX, 2547XXXXXXXX, 2541XXXXXXXX, +2547XXXXXXXX, +2541XXXXXXXX, 7XXXXXXXX, 1XXXXXXXX
 */
export const validateKenyanPhone = (
  input: string
): {
  isValid: boolean;
  normalized: string;
  international: string;
  display: string;
  network: KenyanNetwork;
  networkName: string;
  error?: string;
} => {
  if (!input || !input.trim()) {
    return {
      isValid: false,
      normalized: '',
      international: '',
      display: '',
      network: 'safaricom',
      networkName: 'Safaricom M-PESA',
      error: 'Please enter your Safaricom M-PESA or Airtel Money mobile number.'
    };
  }

  // Strip spaces, dashes, parentheses
  let cleaned = input.trim().replace(/[\s\-()]/g, '');

  if (cleaned.startsWith('+254')) {
    cleaned = cleaned.substring(4);
  } else if (cleaned.startsWith('254')) {
    cleaned = cleaned.substring(3);
  }

  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // A valid Kenyan mobile must start with 7 or 1 and have exactly 8 additional digits (total 9 digits)
  if (!/^(7|1)\d{8}$/.test(cleaned)) {
    return {
      isValid: false,
      normalized: '',
      international: '',
      display: '',
      network: 'safaricom',
      networkName: 'Safaricom M-PESA',
      error: 'Invalid phone number. Enter 10 digits starting with 07 or 01 (e.g. 0712345678).'
    };
  }

  const normalized = `0${cleaned}`;
  const international = `+254${cleaned}`;
  const display = `+254 ${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(6)}`;
  const netInfo = detectKenyanNetwork(cleaned);

  return {
    isValid: true,
    normalized,
    international,
    display,
    network: netInfo.network,
    networkName: netInfo.name
  };
};

/**
 * Validates password: MUST be more than 4 characters
 */
export const validatePassword = (
  password: string
): {
  isValid: boolean;
  error?: string;
} => {
  if (!password) {
    return {
      isValid: false,
      error: 'Password is required.'
    };
  }
  if (password.length <= 4) {
    return {
      isValid: false,
      error: 'Password must be more than 4 characters (minimum 5 characters).'
    };
  }
  return {
    isValid: true
  };
};
