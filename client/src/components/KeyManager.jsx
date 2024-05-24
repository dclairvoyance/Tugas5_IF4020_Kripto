import { useState } from 'react';
import { generateKeyPair, signMessage, verifySignature } from '../utils/schnorr';
import { saveToFile, loadFromFile } from '../utils/fileUtils';

export default function KeyManager() {
  const [alpha, setAlpha] = useState(null);
  const [p, setP] = useState(null);
  const [q, setQ] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState(null);
  const [isSigned, setIsSigned] = useState(false);

  async function fetchPublicKey() {
    const response = await fetch('/api/publicKey');
    const data = await response.json();
    setAlpha(data.alpha);
    setP(data.p);
    setQ(data.q);
  }

  function generateKeys() {
    const { privateKey, publicKey } = generateKeyPair(alpha, p, q);
    setPrivateKey(privateKey);
    setPublicKey(publicKey);
    saveToFile('key.scprv', privateKey.toString());
    saveToFile('key.scpub', publicKey.toString());
  }

  function sign() {
    const sig = signMessage(privateKey, alpha, p, q, message);
    setSignature(sig);
    setIsSigned(true);
  }

  function verify() {
    const isValid = verifySignature(publicKey, alpha, p, q, message, signature);
    alert(isValid ? 'Signature is valid!' : 'Signature is invalid.');
  }

  return (
    <div>
      <button onClick={fetchPublicKey}>Fetch Public Key</button>
      <button onClick={generateKeys} disabled={!alpha || !p || !q}>Generate Keys</button>
      <input type="file" onChange={(e) => loadFromFile(e, (data) => setPrivateKey(parseInt(data, 10)))} />
      <input type="file" onChange={(e) => loadFromFile(e, (data) => setPublicKey(parseInt(data, 10)))} />
      <textarea value={message} onChange={(e) => setMessage(e.target.value)} placeholder="Enter your message here" />
      <button onClick={sign} disabled={!privateKey || !message}>Sign Message</button>
      <button onClick={verify} disabled={!publicKey || !message || !signature}>Verify Message</button>
    </div>
  );
}
