export function isValidEmail(email: string): boolean {
  if (!email || typeof email !== 'string') return false;
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email.trim());
}

export function sanitizeString(val: any, maxLength = 1000): string {
  if (val === null || val === undefined) return '';
  return String(val).trim().slice(0, maxLength);
}

export function checkRequiredFields(body: Record<string, any>, fields: string[]): string | null {
  for (const field of fields) {
    if (body[field] === undefined || body[field] === null || String(body[field]).trim() === '') {
      return `Field '${field}' is required`;
    }
  }
  return null;
}
