export const hexToUInt8Array = (hexString: string): Uint8Array<ArrayBuffer> => {
  if (hexString.length % 2 !== 0) {
    throw new Error('Hex string must have an even number of characters');
  }

  const bytes = new Uint8Array(hexString.length / 2);

  for (let i = 0; i < bytes.length; i++) {
    const byte = hexString.charAt(i * 2) + hexString.charAt(i * 2 + 1);
    bytes[i] = parseInt(byte, 16);
  }

  return bytes;
};
