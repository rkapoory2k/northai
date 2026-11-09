import { isValidPhoneNumber, parsePhoneNumberFromString } from "libphonenumber-js";
import { DEFAULT_PHONE_COUNTRY } from "./config";

export type Lead = { name: string; email: string; phone: string };
export type LeadErrors = Partial<Record<keyof Lead, string>>;

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/** Validates and normalises a lead. Phone is returned in E.164. Shared by client and server. */
export function validateLead(input: Partial<Record<keyof Lead, unknown>>):
  | { ok: true; lead: Lead }
  | { ok: false; errors: LeadErrors } {
  const name = String(input.name ?? "").trim().replace(/\s+/g, " ").slice(0, 120);
  const email = String(input.email ?? "").trim().toLowerCase().slice(0, 200);
  const rawPhone = String(input.phone ?? "").trim().slice(0, 40);
  const errors: LeadErrors = {};

  if (name.length < 2) errors.name = "Please enter your full name.";
  if (!EMAIL_RE.test(email)) errors.email = "Please enter a valid email address.";
  let phone = rawPhone;
  if (!rawPhone || !isValidPhoneNumber(rawPhone, DEFAULT_PHONE_COUNTRY)) {
    errors.phone = "Please enter a valid phone number, including country code if outside the UK.";
  } else {
    phone = parsePhoneNumberFromString(rawPhone, DEFAULT_PHONE_COUNTRY)!.number;
  }
  return Object.keys(errors).length ? { ok: false, errors } : { ok: true, lead: { name, email, phone } };
}

export function splitName(name: string) {
  const [first = "", ...rest] = name.trim().split(/\s+/);
  return { first, last: rest.join(" ") };
}
