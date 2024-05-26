const p = BigInt("0xfffffffffffffffffffffffffffffffeffffffffffffffff");
const a = BigInt("0xfffffffffffffffffffffffffffffffefffffffffffffffc");
// const b = BigInt("0x64210519e59c80e70fa7e9ab72243049feb8deecc146b9b1");
const Gx = BigInt("0x188da80eb03090f67cbf20eb43a18800f4ff0afd82ff1012");
const Gy = BigInt("0x07192b95ffc8da78631011ed6b24ddd573f977a11e794811");

const modInverse = (k, p) => {
  if (k === 0n) throw new Error("Division by zero");
  if (k < 0n) return p - modInverse(-k, p);

  let [s, old_s] = [0n, 1n];
  let [t, old_t] = [1n, 0n];
  let [r, old_r] = [p, k];

  while (r !== 0n) {
    const q = old_r / r;
    [old_r, r] = [r, old_r - q * r];
    [old_s, s] = [s, old_s - q * s];
    [old_t, t] = [t, old_t - q * t];
  }

  return (old_s + p) % p;
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

const calculateTuple = (asciiGroups) => {
  let bigIntegers = [];
  for (let group of asciiGroups) {
    let bigInteger = 0n;
    for (let i = 0; i < group.length; i++) {
      let value = BigInt(group[group.length - 1 - i]);
      bigInteger += value * 256n ** BigInt(i);
    }
    bigIntegers.push(bigInteger);
  }
  return bigIntegers;
};

const bigIntegerToAscii = (bigIntegers) => {
  let asciiValues = [];
  for (let bigInteger of bigIntegers) {
    let asciiValue = [];
    while (bigInteger > 0n) {
      asciiValue.push(Number(bigInteger % 256n));
      bigInteger = bigInteger / 256n;
    }
    asciiValue.reverse();
    asciiValues.push(asciiValue);
  }
  return asciiValues;
};

export const encryptMessage = (text, Pb) => {
  let asciiValues = Array.from(text).map((char) => char.charCodeAt(0));
  let block = 6;
  let k = 1086018370192340982370091274n;

  let groupedAscii = [];
  for (let i = 0; i < asciiValues.length; i += block) {
    groupedAscii.push(asciiValues.slice(i, i + block));
  }

  let tupleValues = calculateTuple(groupedAscii);
  if (tupleValues.length % 2 !== 0) {
    tupleValues.push(32n);
  }

  let pairedList = [];
  for (let i = 0; i < tupleValues.length; i += 2) {
    pairedList.push([tupleValues[i], tupleValues[i + 1]]);
  }

  let kG = pointMultiply([Gx, Gy], k);
  let kPb = pointMultiply(Pb, k);

  let resultEncrypt = [];
  for (let Pm of pairedList) {
    let Pc = pointAdd(kPb, Pm);
    resultEncrypt.push([kG, Pc]);
  }

  return resultEncrypt;
};

export const decryptMessage = (encryptedText, nB) => {
  let resultDecrypt = [];
  for (let [kG, Pc] of encryptedText) {
    let nBkG = pointMultiply(kG, nB);
    let Pm = pointAdd(Pc, [nBkG[0], p - nBkG[1]]);
    resultDecrypt.push(Pm);
  }

  let resultArr = [];
  for (let arr of resultDecrypt) {
    let asciiValue = bigIntegerToAscii([arr[0], arr[1]]);
    resultArr = resultArr.concat(asciiValue);
  }

  let messageArr = [];
  for (let arr of resultArr) {
    messageArr = messageArr.concat(arr);
  }

  let message = messageArr.map((value) => String.fromCharCode(value)).join("");
  return message;
};

export const generatePrivateKey = () => {
  let result = "";
  for (let i = 0; i < 64; i++) {
    const digit = Math.floor(Math.random() * 10);
    result += digit;
  }
  return BigInt(result);
};

export const generatePublicKey = (nB) => {
  return pointMultiply([Gx, Gy], nB);
};
