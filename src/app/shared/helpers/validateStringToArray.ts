export const validateStringToArray = ({ value }: { value: string }): string[] => {
  console.log(value);
  return value ? [...new Set(value.split(',').map((i) => i.toString().trim()))] : [];
};
