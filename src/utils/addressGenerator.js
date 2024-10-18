export const generateSimilarAddress = () => {
  const prefix = 'D6HekMqBP3zbPVT2HQb8yn';  // The fixed part of the address
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let address = prefix;  // Start with the given prefix

  // Generate the remaining characters to make the address 34 characters long
  for (let i = 0; i < 11; i++) {  // 34 - length of the prefix (23) = 11
    const randomIndex = Math.floor(Math.random() * characters.length);
    address += characters[randomIndex];
  }

  return address;
};
