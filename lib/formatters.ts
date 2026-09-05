/**
 * Formats numbers into Rwandan Francs (RWF)
 * Example: 12500 -> "RWF 12,500"
 */
export function formatRWF(amount: number): string {
  const formatted = new Intl.NumberFormat('en-RW', {
    maximumFractionDigits: 0,
  }).format(Math.abs(amount));

  return amount < 0 ? `-RWF ${formatted}` : `RWF ${formatted}`;
}

/**
 * Formats a 16-digit card number with masking
 * Example: "9400102030404821" -> "**** **** **** 4821"
 * or short format -> "**** 4821"
 */
export function formatMaskedCard(cardNumber: string, full = false): string {
  if (!cardNumber) return "**** 0000";
  const clean = cardNumber.replace(/\s+/g, '');
  const last4 = clean.slice(-4);
  if (full) {
    return `**** **** **** ${last4}`;
  }
  return `**** ${last4}`;
}

/**
 * Formats a Rwanda phone number nicely
 * Example: "+250788123456" or "0788123456" -> "+250 788 123 456"
 */
export function formatRwandaPhone(phone: string): string {
  const clean = phone.replace(/[^0-9]/g, '');
  if (clean.startsWith('250') && clean.length === 12) {
    return `+250 ${clean.slice(3, 6)} ${clean.slice(6, 9)} ${clean.slice(9)}`;
  }
  if (clean.length === 10 && clean.startsWith('07')) {
    return `+250 ${clean.slice(1, 4)} ${clean.slice(4, 7)} ${clean.slice(7)}`;
  }
  return phone;
}

/**
 * Human friendly date formatter (e.g., "Today, 08:42", "Yesterday, 17:31", "Mar 4, 14:20")
 */
export function formatRelativeDate(isoString: string): string {
  try {
    const date = new Date(isoString);
    const now = new Date();
    
    // Check if same calendar day
    const isToday = date.toDateString() === now.toDateString();
    
    const yesterday = new Date(now);
    yesterday.setDate(now.getDate() - 1);
    const isYesterday = date.toDateString() === yesterday.toDateString();

    const timeStr = date.toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
      hour12: false,
    });

    if (isToday) {
      return `Today, ${timeStr}`;
    }
    if (isYesterday) {
      return `Yesterday, ${timeStr}`;
    }
    return `${date.toLocaleDateString('en-GB', { day: 'numeric', month: 'short' })}, ${timeStr}`;
  } catch {
    return isoString;
  }
}
