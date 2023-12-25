export const validateStringToBoolean = ({ value }: { value: string }): boolean => {
  return value.toLowerCase() === 'да';
};
