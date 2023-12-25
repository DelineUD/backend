export const validateStringToBoolean = ({ value }: { value: string }): boolean => {
  console.log(value);
  return value.toLowerCase() === 'да';
};
