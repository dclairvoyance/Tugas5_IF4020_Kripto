// Delazi Algorithm
// Irreducible Polynomial x^8 + x^7 + x^5 + x^3 + 1

import { mod256, stringToHex, hexPadding } from "./helpers";

// constants: 16x16 of 1 byte in hex (ex: [0x63, ...])
const SBOX = [
  0x63, 0x7c, 0xa6, 0xe5, 0x81, 0x6d, 0x20, 0x83, 0x12, 0xb0, 0x2e, 0xe6, 0xc2,
  0x79, 0x13, 0x15, 0x91, 0x3d, 0xc0, 0x6a, 0x8f, 0xa9, 0xa1, 0x19, 0xb3, 0xdf,
  0x6e, 0x5e, 0x11, 0x6c, 0x58, 0x27, 0x1a, 0xa0, 0x06, 0xd0, 0xb2, 0xa3, 0xe7,
  0x66, 0x5f, 0xff, 0x4c, 0x7b, 0x48, 0xfb, 0x14, 0xd4, 0x41, 0x54, 0x77, 0xda,
  0xaf, 0x9b, 0xfd, 0xc3, 0x10, 0x39, 0xae, 0xf7, 0xb4, 0x01, 0x0b, 0x25, 0x95,
  0xd2, 0xc8, 0xca, 0xd1, 0x34, 0xba, 0x31, 0xc1, 0xd3, 0x49, 0x55, 0x21, 0x9c,
  0xab, 0xea, 0x7d, 0x56, 0x2d, 0x02, 0xf4, 0x87, 0x6f, 0x07, 0xbc, 0xfc, 0x65,
  0xfe, 0xd8, 0x2b, 0xf2, 0xb8, 0x38, 0x28, 0xf8, 0xdd, 0x23, 0x7e, 0xbf, 0x80,
  0x05, 0x9f, 0x1f, 0x72, 0x2c, 0xe2, 0x33, 0xdc, 0x90, 0xf1, 0x4e, 0xaa, 0x85,
  0xd7, 0x29, 0x98, 0x88, 0xb5, 0x18, 0x17, 0x1d, 0x6b, 0x0a, 0xd9, 0x52, 0x86,
  0xbb, 0x8a, 0xb6, 0xee, 0xb7, 0xe8, 0x3a, 0xcb, 0x82, 0xa2, 0xc5, 0x4f, 0x4a,
  0x62, 0x32, 0x74, 0x3b, 0x61, 0x3c, 0x24, 0x78, 0xe0, 0x42, 0xb9, 0xd6, 0x44,
  0x4d, 0xf3, 0xed, 0xf0, 0x26, 0x89, 0xf9, 0xa5, 0x0e, 0x09, 0x99, 0xec, 0xa8,
  0xb1, 0x5b, 0xdb, 0x2f, 0x45, 0x51, 0x97, 0x8c, 0x7a, 0xac, 0x75, 0x2a, 0xbd,
  0xad, 0xe3, 0xbe, 0xcf, 0x47, 0x37, 0xe1, 0x93, 0xc4, 0xc9, 0xce, 0xc7, 0xc6,
  0x0c, 0xe4, 0x04, 0x76, 0x69, 0x43, 0xde, 0xa7, 0xef, 0x0d, 0x84, 0x92, 0x22,
  0x50, 0x68, 0x57, 0x1b, 0x5d, 0xfa, 0xeb, 0x36, 0x8e, 0x8d, 0xe9, 0x7f, 0x4b,
  0x71, 0xf6, 0x03, 0x9a, 0xd5, 0x60, 0x1c, 0xf5, 0x1e, 0xcd, 0xa4, 0x5a, 0x8b,
  0x73, 0x16, 0x46, 0x64, 0x9e, 0x00, 0x96, 0x0f, 0x08, 0x70, 0x94, 0x30, 0x59,
  0x53, 0x5c, 0xcc, 0x67, 0x40, 0x9d, 0x35, 0x3e, 0x3f,
];

const INVERSE_SBOX = [
  0xef, 0x3d, 0x53, 0xdf, 0xc5, 0x68, 0x22, 0x57, 0xf2, 0xa5, 0x7e, 0x3e, 0xc3,
  0xcc, 0xa4, 0xf1, 0x38, 0x1c, 0x08, 0x0e, 0x2e, 0x0f, 0xeb, 0x7b, 0x7a, 0x17,
  0x20, 0xd3, 0xe3, 0x7c, 0xe5, 0x6a, 0x06, 0x4c, 0xcf, 0x64, 0x95, 0x3f, 0xa0,
  0x1f, 0x61, 0x76, 0xb4, 0x5d, 0x6c, 0x52, 0x0a, 0xac, 0xf5, 0x47, 0x90, 0x6e,
  0x45, 0xfd, 0xd7, 0xbb, 0x60, 0x39, 0x88, 0x92, 0x94, 0x11, 0xfe, 0xff, 0xfb,
  0x30, 0x98, 0xc8, 0x9b, 0xad, 0xec, 0xba, 0x2c, 0x4a, 0x8e, 0xdc, 0x2a, 0x9c,
  0x72, 0x8d, 0xd0, 0xae, 0x80, 0xf7, 0x31, 0x4b, 0x51, 0xd2, 0x1e, 0xf6, 0xe8,
  0xaa, 0xf8, 0xd4, 0x1b, 0x28, 0xe2, 0x93, 0x8f, 0x00, 0xed, 0x5a, 0x27, 0xfa,
  0xd1, 0xc7, 0x13, 0x7d, 0x1d, 0x05, 0x1a, 0x56, 0xf3, 0xdd, 0x6b, 0xea, 0x91,
  0xb3, 0xc6, 0x32, 0x96, 0x0d, 0xb1, 0x2b, 0x01, 0x50, 0x65, 0xdb, 0x67, 0x04,
  0x8a, 0x07, 0xcd, 0x74, 0x81, 0x55, 0x78, 0xa1, 0x83, 0xe9, 0xb0, 0xd9, 0xd8,
  0x14, 0x70, 0x10, 0xce, 0xbd, 0xf4, 0x40, 0xf0, 0xaf, 0x77, 0xa6, 0xe0, 0x35,
  0x4d, 0xfc, 0xee, 0x69, 0x21, 0x16, 0x8b, 0x25, 0xe7, 0xa3, 0x02, 0xca, 0xa8,
  0x15, 0x73, 0x4e, 0xb2, 0xb6, 0x3a, 0x34, 0x09, 0xa9, 0x24, 0x18, 0x3c, 0x79,
  0x84, 0x86, 0x5f, 0x99, 0x46, 0x82, 0x58, 0xb5, 0xb8, 0x66, 0x12, 0x48, 0x0c,
  0x37, 0xbe, 0x8c, 0xc2, 0xc1, 0x42, 0xbf, 0x43, 0x89, 0xf9, 0xe6, 0xc0, 0xb9,
  0x23, 0x44, 0x41, 0x49, 0x2f, 0xe1, 0x9a, 0x75, 0x5c, 0x7f, 0x33, 0xab, 0x6f,
  0x63, 0xc9, 0x19, 0x97, 0xbc, 0x6d, 0xb7, 0xc4, 0x03, 0x0b, 0x26, 0x87, 0xda,
  0x4f, 0xd6, 0xa7, 0x9e, 0x85, 0xcb, 0x9f, 0x71, 0x5e, 0x9d, 0x54, 0xe4, 0xde,
  0x3b, 0x62, 0xa2, 0xd5, 0x2d, 0x59, 0x36, 0x5b, 0x29,
];

// key expander (64 bytes)
const KEY_EXPANDER_STRING =
  "gyattrizzlersigmaohiofanumtaxjdonmysoulshuwalahumbatugaskriptoduar";
const KEY_EXPANDER_HEX = stringToHex(KEY_EXPANDER_STRING);
// init_vector (16 bytes)
const INIT_VECTOR_STRING = "adalahinitvector";
const INIT_VECTOR_HEX = stringToHex(INIT_VECTOR_STRING);

// input: a-b-c-d (4 bytes)
// output: d-c-b-a (4 bytes)
const mixKey = (input) => {
  let output = "";
  for (let i = 6; i >= 0; i -= 2) {
    output += input[i] + input[i + 1];
  }
  return output;
};

// get value of sbox from row-col
const getSboxValue = (row, col) => {
  const index = 16 * row + col;
  return SBOX[index];
};

// get value of inverse sbox from row-col
const getInverseSboxValue = (row, col) => {
  const index = 16 * row + col;
  return INVERSE_SBOX[index];
};

// generate round key (round + 1 times):
// key = 24 byte -> round = 12 -> expand key to 4*(12 + 1) + 12 = 64 byte
const keyExpansion = (externalKeyHex) => {
  let resultKey = externalKeyHex;

  // xor 24 bytes of external key with first 24 bytes of key expander
  const expanderChunk1 = KEY_EXPANDER_HEX.slice(0, 48);
  const externalKeyChunk1 = externalKeyHex.slice(0, 48);
  let resultChunk1 = "";
  for (let i = 0; i < expanderChunk1.length; i += 2) {
    resultChunk1 += (
      parseInt(expanderChunk1.slice(i, i + 2), 16) ^
      parseInt(externalKeyChunk1.slice(i, i + 2), 16)
    )
      .toString(16)
      .padStart(2, "0");
  }

  // xor first 16 bytes of external key with last 16 bytes of key expander
  const expanderChunk2 = KEY_EXPANDER_HEX.slice(48, 80);
  const externalKeyChunk2 = externalKeyHex.slice(0, 32);
  let resultChunk2 = "";
  for (let i = 0; i < expanderChunk2.length; i += 2) {
    resultChunk2 += (
      parseInt(expanderChunk2.slice(i, i + 2), 16) ^
      parseInt(externalKeyChunk2.slice(i, i + 2), 16)
    )
      .toString(16)
      .padStart(2, "0");
  }

  // combine results
  resultKey += resultChunk1 + resultChunk2;

  // mix results
  let resultKeyMix = "";
  for (let i = 0; i < resultKey.length; i += 8) {
    resultKeyMix += mixKey(resultKey.slice(i, i + 8));
  }

  return resultKeyMix;
};

// lazi process: encrypt
const laziEncrypt = (inputHex) => {
  let outputHex = "";
  // process every 4 bytes
  for (let i = 0; i < inputHex.length; i += 8) {
    // input: (a, b, c, d)
    // output: (d, b + c + d, c + d, a + b + c + d)
    outputHex += inputHex.slice(i + 6, i + 8);
    outputHex += (
      (parseInt(inputHex.slice(i + 2, i + 4), 16) +
        parseInt(inputHex.slice(i + 4, i + 6), 16) +
        parseInt(inputHex.slice(i + 6, i + 8), 16)) %
      256
    )
      .toString(16)
      .padStart(2, "0");
    outputHex += (
      (parseInt(inputHex.slice(i + 4, i + 6), 16) +
        parseInt(inputHex.slice(i + 6, i + 8), 16)) %
      256
    )
      .toString(16)
      .padStart(2, "0");
    outputHex += (
      (parseInt(inputHex.slice(i, i + 2), 16) +
        parseInt(inputHex.slice(i + 2, i + 4), 16) +
        parseInt(inputHex.slice(i + 4, i + 6), 16) +
        parseInt(inputHex.slice(i + 6, i + 8), 16)) %
      256
    )
      .toString(16)
      .padStart(2, "0");
  }
  return outputHex;
};

// lazi process: decrypt
const laziDecrypt = (inputHex) => {
  let outputHex = "";
  // process every 4 bytes
  for (let i = 0; i < inputHex.length; i += 8) {
    // input: (d, b + c + d, c + d, a + b + c + d)
    // output: (a, b, c, d)
    const d = inputHex.slice(i, i + 2);
    const c = mod256(
      parseInt(inputHex.slice(i + 4, i + 6), 16) - parseInt(d, 16)
    )
      .toString(16)
      .padStart(2, "0");
    const b = mod256(
      parseInt(inputHex.slice(i + 2, i + 4), 16) -
        parseInt(c, 16) -
        parseInt(d, 16)
    )
      .toString(16)
      .padStart(2, "0");
    const a = mod256(
      parseInt(inputHex.slice(i + 6, i + 8), 16) -
        parseInt(b, 16) -
        parseInt(c, 16) -
        parseInt(d, 16)
    )
      .toString(16)
      .padStart(2, "0");
    outputHex += a + b + c + d;
  }
  return outputHex;
};

// xor block with round key
const xorHex = (inputHex, keyHex) => {
  let resultHex = "";
  for (let i = 0; i < inputHex.length; i += 2) {
    resultHex += (
      parseInt(inputHex.slice(i, i + 2), 16) ^
      parseInt(keyHex.slice(i, i + 2), 16)
    )
      .toString(16)
      .padStart(2, "0");
  }
  return resultHex;
};

// encrypt with sbox (row-col -> value)
const sboxEncrypt = (inputHex) => {
  let outputHex = "";
  for (let i = 0; i < inputHex.length; i += 2) {
    const row = parseInt(inputHex[i], 16);
    const col = parseInt(inputHex[i + 1], 16);
    const resultHex = getSboxValue(row, col).toString(16).padStart(2, "0");
    outputHex += resultHex;
  }
  return outputHex;
};

// decrypt with sbox (row-col -> value)
const sboxDecrypt = (inputHex) => {
  let outputHex = "";
  for (let i = 0; i < inputHex.length; i += 2) {
    const row = parseInt(inputHex[i], 16);
    const col = parseInt(inputHex[i + 1], 16);
    const resultHex = getInverseSboxValue(row, col)
      .toString(16)
      .padStart(2, "0");
    outputHex += resultHex;
  }
  return outputHex;
};

// flip row
const flipRowCol = (inputHex) => {
  let outputHex = "";
  const order = [5, 4, 7, 6, 1, 0, 3, 2, 13, 12, 15, 14, 9, 8, 11, 10];
  for (const i of order) {
    outputHex += inputHex.slice(i * 2, (i + 1) * 2);
  }
  return outputHex;
};

// ecb mode: encrypt
export const encrypt = (inputHex, externalKey) => {
  inputHex = hexPadding(inputHex);
  const externalKeyHex = stringToHex(externalKey);

  let encryptedHex = "";
  const expandedKeyHex = keyExpansion(externalKeyHex, 12);
  let vectorHex = INIT_VECTOR_HEX;

  for (let i = 0; i < inputHex.length; i += 32) {
    // xor vector hex with plaintext
    let chunkHex = inputHex.slice(i, i + 32);
    let resultHex = xorHex(chunkHex, vectorHex);

    // add round key
    resultHex = xorHex(resultHex, expandedKeyHex.slice(0, 32));

    // round enciphering
    for (let j = 1; j <= 12; j++) {
      resultHex = sboxEncrypt(resultHex);
      resultHex = flipRowCol(resultHex);
      resultHex = laziEncrypt(resultHex);
      resultHex = xorHex(resultHex, expandedKeyHex.slice(j * 8, j * 8 + 32));
    }

    vectorHex = resultHex;
    encryptedHex += resultHex;
  }
  return encryptedHex;
};

// ecb mode: decrypt
export const decrypt = (inputHex, externalKey) => {
  const externalKeyHex = stringToHex(externalKey);

  let decryptedHex = "";
  const expandedKeyHex = keyExpansion(externalKeyHex, 12);
  let vectorHex = INIT_VECTOR_HEX;

  for (let i = 0; i < inputHex.length; i += 32) {
    let resultHex = inputHex.slice(i, i + 32);

    // round deciphering
    for (let j = 12; j > 0; j--) {
      resultHex = xorHex(resultHex, expandedKeyHex.slice(j * 8, j * 8 + 32));
      resultHex = laziDecrypt(resultHex);
      resultHex = flipRowCol(resultHex);
      resultHex = sboxDecrypt(resultHex);
    }

    // inverse add round key
    resultHex = xorHex(resultHex, expandedKeyHex.slice(0, 32));

    // inverse xor vector hex
    resultHex = xorHex(resultHex, vectorHex);

    vectorHex = inputHex.slice(i, i + 32);
    decryptedHex += resultHex;
  }
  return decryptedHex;
};
