const parsePriceToNumber = (raw: string): number => {
  const digits = raw.replace(/[^\d]/g, '');
  return digits.length === 0 ? 0 : Number(digits);
};

export default parsePriceToNumber;
