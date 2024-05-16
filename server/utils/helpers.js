export const hexPadding = (inputHex) => {
  let padding = (inputHex.length / 2) % 16;
  let outputHex = inputHex;
  if (padding != 0) {
    outputHex += "5a".repeat(16 - padding);
  }
  return outputHex;
};

// convert string to hex
export const stringToHex = (string) => {
  return string
    .split("")
    .map((c) => c.charCodeAt(0).toString(16).padStart(2, "0"))
    .join("");
};

// convert hex to string
export const hexToString = (hex) => {
  hex = hex.replace(/\s+/g, "").toLowerCase();
  let string = "";
  for (let i = 0; i < hex.length; i += 2) {
    string += String.fromCharCode(parseInt(hex.substr(i, 2), 16));
  }
  return string;
};

// modulo 256 positive only
export const mod256 = (int) => {
  return ((int % 256) + 256) % 256;
};

// check if shared key expired
export const isSharedKeyExpired = (dateString) => {
  const storedDate = new Date(dateString);
  const currentDate = new Date();
  const timeDifference = currentDate - storedDate;
  const dayDifference = timeDifference / (1000 * 60 * 60 * 24);
  return dayDifference >= 7;
};
