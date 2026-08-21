/**
 * Session admin minimaliste : un cookie httpOnly contenant
 * `expiration.signatureHMAC`. Vérifiable côté Edge (middleware)
 * comme côté Node grâce à Web Crypto.
 */

export const SESSION_COOKIE = "finora_admin";
const MAX_AGE_SECONDS = 60 * 60 * 8; // 8 heures

function secret() {
  return process.env.AUTH_SECRET || "dev-secret-a-remplacer-en-production";
}

function toBase64Url(bytes: ArrayBuffer) {
  const octets = new Uint8Array(bytes);
  let binary = "";
  for (let i = 0; i < octets.length; i++) {
    binary += String.fromCharCode(octets[i]);
  }
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

async function sign(payload: string) {
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(secret()),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );
  const signature = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(payload)
  );
  return toBase64Url(signature);
}

export async function createSessionToken(): Promise<{
  value: string;
  maxAge: number;
}> {
  const expiresAt = String(Date.now() + MAX_AGE_SECONDS * 1000);
  const signature = await sign(expiresAt);
  return { value: `${expiresAt}.${signature}`, maxAge: MAX_AGE_SECONDS };
}

export async function verifySessionToken(
  token: string | undefined
): Promise<boolean> {
  if (!token) return false;
  const [expiresAt, signature] = token.split(".");
  if (!expiresAt || !signature) return false;
  if (Number(expiresAt) < Date.now()) return false;
  const expected = await sign(expiresAt);
  // Comparaison à longueur constante
  if (expected.length !== signature.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= expected.charCodeAt(i) ^ signature.charCodeAt(i);
  }
  return diff === 0;
}

export function checkPassword(input: string): boolean {
  const expected = process.env.ADMIN_PASSWORD || "";
  if (!expected) return false;
  if (input.length !== expected.length) return false;
  let diff = 0;
  for (let i = 0; i < expected.length; i++) {
    diff |= input.charCodeAt(i) ^ expected.charCodeAt(i);
  }
  return diff === 0;
}
