// Function to perform modular exponentiation
function modExp(base, exp, mod) {
    let result = 1;
    base = base % mod;
    while (exp > 0) {
      if (exp % 2 === 1) {
        result = (result * base) % mod;
      }
      exp = Math.floor(exp / 2);
      base = (base * base) % mod;
    }
    return result;
  }
  
  // Function to generate a key pair
  export function generateKeyPair(alpha, p, q) {
    const privateKey = Math.floor(Math.random() * q); // x: private key
    const publicKey = modExp(alpha, privateKey, p); // y: public key
    return { privateKey, publicKey };
  }
  
  // Function to sign a message
  export function signMessage(privateKey, alpha, p, q, message) {
    const k = Math.floor(Math.random() * q); // Random nonce
    const r = modExp(alpha, k, p); // r value
    const e = hash(r + message); // e value, assuming hash is a simple hash function
    const s = (k + privateKey * e) % q; // s value
    return { r, s };
  }
  
  // Simple hash function for demonstration
  function hash(input) {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
      const char = input.charCodeAt(i);
      hash = (hash << 5) - hash + char;
      hash |= 0; // Convert to 32-bit integer
    }
    return hash;
  }
  
  // Function to verify a signature
  export function verifySignature(publicKey, alpha, p, q, message, signature) {
    const { r, s } = signature;
    const e = hash(r + message); // e value
    const leftHandSide = modExp(alpha, s, p);
    const rightHandSide = (r * modExp(publicKey, e, p)) % p;
    return leftHandSide === rightHandSide;
  }
  