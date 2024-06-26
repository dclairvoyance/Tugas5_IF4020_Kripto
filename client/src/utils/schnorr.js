/* eslint-disable no-constant-condition */
import { randBetween } from "bigint-crypto-utils";
import CryptoJS from "crypto-js";

// calculate base^exp mod (mod)
// note: algorithm optimized by ChatGPT
const modExp = (base, exp, mod) => {
  let result = 1n;
  base = base % mod;
  while (exp > 0) {
    if (exp % 2n === 1n) {
      result = (result * base) % mod;
    }
    exp = exp / 2n;
    base = (base * base) % mod;
  }
  return result;
};

// generate private key s and public key v
export const generateKeys = (p, q, alpha) => {
  // generate s (private key) such that 0 < s < q
  const s = randBetween(q - 1n);

  // generate v (public key) such that v ≡ α^(-s) (mod p)
  // v ≡ α^(-s) (mod p) <-> v ≡ α^(q-1-s) (mod p)
  // since α^q-1 ≡ 1 (mod p) -> Fermat's theorem
  // supposedly optimized compared to calculating modInverse
  const v = modExp(alpha, p - 1n - s, p);

  return { s, v };
};

// generate digital signature (e, y)
export const generateSignature = (message, p, q, alpha, s) => {
  // generate r such that 0 < r < q
  const r = randBetween(q - 1n);

  // calculate x = α^r mod p (pre-processing)
  const x = modExp(alpha, r, p);

  // concat message M to x
  const concated = message.trim() + x.toString();

  // hash concated message with SHA-1
  const hash = CryptoJS.SHA1(concated);
  const e = BigInt("0x" + hash.toString(CryptoJS.enc.Hex));

  // generate y = (r + se) mod q
  const y = (r + s * e) % q;

  return { e, y };
};

// verify digital signature
export const verifySignature = (message, p, alpha, v, signature) => {
  const { e, y } = signature;

  // calculate x’ = α^y * v^e mod p
  const x_ = (modExp(alpha, y, p) * modExp(v, e, p)) % p;

  // concat message M to x'
  const concated = message.trim() + x_.toString();

  // hash concated message with SHA-1
  const hash = CryptoJS.SHA1(concated);
  const e_ = BigInt("0x" + hash.toString(CryptoJS.enc.Hex));

  // verify e' = e where e' = H (M || x’)
  return e === e_;
};
