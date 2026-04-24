import { randomBytes, pbkdf2 as pbkdf2Callback, timingSafeEqual } from "crypto";
import { promisify } from "util";

const pbkdf2 = promisify(pbkdf2Callback);

const PASSWORD_ALGORITHM = "pbkdf2";
const PASSWORD_DIGEST = "sha256";
const PASSWORD_ITERATIONS = 310000;
const PASSWORD_KEY_LENGTH = 32;
const PASSWORD_SALT_BYTES = 16;

function toBase64Url(value: Buffer) {
  return value.toString("base64url");
}

function fromBase64Url(value: string) {
  return Buffer.from(value, "base64url");
}

export async function hashPassword(password: string) {
  const salt = randomBytes(PASSWORD_SALT_BYTES);
  const derivedKey = (await pbkdf2(password, salt, PASSWORD_ITERATIONS, PASSWORD_KEY_LENGTH, PASSWORD_DIGEST)) as Buffer;

  return [
    PASSWORD_ALGORITHM,
    PASSWORD_DIGEST,
    String(PASSWORD_ITERATIONS),
    toBase64Url(salt),
    toBase64Url(derivedKey),
  ].join("$");
}

export async function verifyPassword(password: string, storedPassword: string) {
  const parts = storedPassword.split("$");
  if (parts.length !== 5) {
    return false;
  }

  const [algorithm, digest, iterationsText, saltText, hashText] = parts;
  if (algorithm !== PASSWORD_ALGORITHM || digest !== PASSWORD_DIGEST) {
    return false;
  }

  const iterations = Number(iterationsText);
  if (!Number.isInteger(iterations) || iterations <= 0) {
    return false;
  }

  const salt = fromBase64Url(saltText);
  const expectedHash = fromBase64Url(hashText);
  const actualHash = (await pbkdf2(password, salt, iterations, expectedHash.length, digest)) as Buffer;

  if (actualHash.length !== expectedHash.length) {
    return false;
  }

  return timingSafeEqual(actualHash, expectedHash);
}