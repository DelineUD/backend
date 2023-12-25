export const validateStringToBoolean = ({ value }: { value: string }): boolean => {
  return value.toString().toLowerCase() === 'да';
};
