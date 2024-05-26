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
export const generateKeys = async (p, q, alpha) => {
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
  const concated = message + x.toString();

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
  // alpha^y * v^e % p
  // 2^8 * 1^3 % 23 = 256 * 1 % 23 = 3
  // 1^3 % 23 = 1

  // alpha^(y-se % q) % p
  // 2^(8 - 7*3 % 11) % 23 = 2^(9) % 23 = 512 % 23 = 6
  // 2^(-7*3 % 23) % 23 = 2^2 % 23 = 4

  // alpha^r
  // 2^9 % 23 = 512 % 23 = 6

  // concat message M to x'
  const concated = message.trim() + x_.toString();

  // hash concated message with SHA-1
  const hash = CryptoJS.SHA1(concated);
  const e_ = BigInt("0x" + hash.toString(CryptoJS.enc.Hex));

  // verify e' = e where e' = H (M || x’)
  return e === e_;
};

(async () => {
  //   const p = 23n;
  //   const q = 11n;
  //   const alpha = 2n;;

  const p =
    157754757658850164039820501368692494984638811981595753785726084071390339342949827166074468203116945260071420591948184266427919389750857419939387549499186051557325946160152109714671771886387784860670680481921786590260608186162263954672484772147274284399498187140357851764561666898851637006570752518678867635307n;
  const q = 1331985975749110751467452671644594430583873510479n;
  const alpha =
    147898545040606209330230055267646210530048641427472555641518780529319888952924449556772555570317947086022121909734653034292067334334687959961597799568568987279946842584777692484878672986933866319818683030808864041201327429509854041153169303558986971095604768418830701291626138041045041681927765991510706817653n;

  console.log("p: ", p);
  console.log("q: ", q);
  console.log("alpha: ", alpha);

  const { s, v } = await generateKeys(p, q, alpha);

  const message = "Hello, Schnorr!";
  const signature = generateSignature(message, p, q, alpha, s);
  const verified = verifySignature(message, p, alpha, v, signature);
  console.log(verified);
})();
