export const validateStringToArray = ({ value }: { value: string }): string[] => {
  return value ? [...new Set(value.split(',').map((i) => i.toString().trim()))] : [];
};
