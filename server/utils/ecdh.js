// import { hexToString } from "./helpers.js";

// elliptic curve parameters for secp192r1
// note: b is never used as addition always done to the point itself
const p = BigInt("0xfffffffffffffffffffffffffffffffeffffffffffffffff");
const a = BigInt("0xfffffffffffffffffffffffffffffffefffffffffffffffc");
// const b = BigInt("0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1");
const Gx = BigInt("0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012");
const Gy = BigInt("0x07192b95ffc8da78631011ed6b24ddd573f977a11e794811");
const n = BigInt("0xffffffffffffffffffffffff99def836146bc9b1b4d22831");

// inverse, addition, and scalar multiplication
const modInverse = (k, p) => {
  if (k === 0n) {
    throw new Error("/0");
  }
  if (k < 0n) {
    return p - modInverse(-k, p);
  }
  let [s, s_] = [0n, 1n];
  let [t, t_] = [1n, 0n];
  let [r, r_] = [p, k];
  while (r !== 0n) {
    const q = r_ / r;
    [r_, r] = [r, r_ - q * r];
    [s_, s] = [s, s_ - q * s];
    [t_, t] = [t, t_ - q * t];
  }
  return (s_ + p) % p;
};

const pointAdd = (point1, point2) => {
  const [x1, y1] = point1;
  const [x2, y2] = point2;
  if (x1 === 0n && y1 === 0n) return [x2, y2];
  if (x2 === 0n && y2 === 0n) return [x1, y1];
  if (x1 === x2 && y1 === p - y2) return [0n, 0n];

  let m;
  if (x1 === x2 && y1 === y2) {
    m = (3n * x1 * x1 + a) * modInverse(2n * y1, p);
  } else {
    m = (y2 - y1) * modInverse(x2 - x1, p);
  }

  const x3 = (m * m - x1 - x2) % p;
  const y3 = (m * (x1 - x3) - y1) % p;

  return [(x3 + p) % p, (y3 + p) % p];
};

const pointMultiply = (point, k) => {
  let result = [0n, 0n];
  let doubler = point;

  while (k > 0n) {
    if (k % 2n === 1n) {
      result = pointAdd(result, doubler);
    }
    doubler = pointAdd(doubler, doubler);
    k = k / 2n;
  }
  return result;
};

// generate random private key in 0 <= key <= n
const generatePrivateKey = () => {
  let privateKey = 0n;
  while (privateKey <= 0n || privateKey >= n) {
    // generate 24 bytes (192 bits) in hex
    privateKey = BigInt(
      "0x" +
        Array.from({ length: 24 }, () =>
          Math.floor(Math.random() * 256)
            .toString(16)
            .padStart(2, "0")
        ).join("")
    );
  }
  return privateKey;
};

// generate public key
const generatePublicKey = (privateKey) => {
  return pointMultiply([Gx, Gy], privateKey);
};

// calculate shared key
// handshake process (2)
export const calculateSharedKey = (privateKey, publicKey) => {
  // use x-coordinate to simplify
  const sharedKey = pointMultiply(publicKey, privateKey)[0];
  return convertECtoBC(sharedKey);
};

// convert elliptic curve key to block cipher key
// return key should be a 24 bytes (192 bit) string
// note: algorithm inspired by ChatGPT
const convertECtoBC = (input) => {
  const inputHex = input.toString(16);
  let hash = 0n;
  for (let i = 0; i < inputHex.length; i++) {
    hash = (hash * 31n + BigInt(inputHex.charCodeAt(i))) % p;
  }
  return hash.toString(16).padStart(64, "0").slice(0, 48);
};

// handshake process (1)
export const generateKey = () => {
  const privateKey = generatePrivateKey();
  const publicKey = generatePublicKey(privateKey);
  return { privateKey, publicKey };
};
