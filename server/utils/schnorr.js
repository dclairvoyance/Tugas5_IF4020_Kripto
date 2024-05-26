import { prime, isProbablyPrime, randBetween } from "bigint-crypto-utils";

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

// generate p (1024 bit) and q (160 bit) primes, where p ≡ 1 (mod q)
export const generatePandQ = () => {
  // generate prime q
  //   const q = await prime(160);
  //   console.log(q);

  // generate prime p such that p = k*q + 1
  // supposedly optimized compared to generating p such that p ≡ 1 (mod q)
  //   let p;
  //   while (true) {
  //     // 864 + 160 = 1024
  //     const k = await prime(864);
  //     p = k * q + 1n;
  //     // 64 is number of iterations for confidence level
  //     if (await isProbablyPrime(p, 16)) {
  //       break;
  //     }
  //     console.log(p);
  //   }

  //   let p;
  //   while (true) {
  //     p = await prime(512);
  //     if (modExp(p, 1n, q) === 1n) {
  //       break;
  //     }
  //     console.log(p);
  //   }

  // generate alpha such that α^q ≡ 1 (mod p) or α^q mod p = 1
  //   let alpha;
  //   while (true) {
  //     console.log(p - 1n);
  //     alpha = randBetween(2n, p - 1n);
  //     console.log(alpha);
  //     if (modExp(alpha, q, p) === 1n) {
  //       break;
  //     }
  //   }

  const p =
    157754757658850164039820501368692494984638811981595753785726084071390339342949827166074468203116945260071420591948184266427919389750857419939387549499186051557325946160152109714671771886387784860670680481921786590260608186162263954672484772147274284399498187140357851764561666898851637006570752518678867635307n;
  const q = 1331985975749110751467452671644594430583873510479n;
  const alpha =
    147898545040606209330230055267646210530048641427472555641518780529319888952924449556772555570317947086022121909734653034292067334334687959961597799568568987279946842584777692484878672986933866319818683030808864041201327429509854041153169303558986971095604768418830701291626138041045041681927765991510706817653n;

  console.log("p, q, and alpha generated");

  return { p, q, alpha };
};
