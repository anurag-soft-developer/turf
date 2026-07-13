import { parsePhoneNumberFromString } from "libphonenumber-js";

/**
 * Normalize a phone to E.164. Requires an explicit country calling code
 * (leading `+`); national-only numbers are rejected.
 */
export function normalizePhone(input: string): string {
  const trimmed = input.trim();
  if (!trimmed.startsWith("+")) {
    throw new Error("Phone must include country code, e.g. +919876543210");
  }
  const parsed = parsePhoneNumberFromString(trimmed);
  if (!parsed?.isValid()) {
    throw new Error("Invalid phone number");
  }
  return parsed.format("E.164");
}

export type AuthContact = { email: string; phone?: never } | { phone: string; email?: never };

/**
 * Resolve a UI identifier to exactly one of email or phone for API bodies.
 * `@` → email; leading `+` → phone (normalized E.164).
 */
export function resolveAuthIdentifier(raw: string): AuthContact {
  const trimmed = raw.trim();
  if (!trimmed) {
    throw new Error("Email or phone is required");
  }

  if (trimmed.includes("@")) {
    return { email: trimmed.toLowerCase() };
  }

  if (trimmed.startsWith("+")) {
    return { phone: normalizePhone(trimmed) };
  }

  throw new Error(
    "Enter an email or phone with country code (e.g. +919876543210)",
  );
}

/** Zod-friendly: returns error message or null if valid. */
export function validateAuthIdentifier(raw: string): string | null {
  try {
    resolveAuthIdentifier(raw);
    return null;
  } catch (e) {
    return e instanceof Error ? e.message : "Invalid email or phone";
  }
}
