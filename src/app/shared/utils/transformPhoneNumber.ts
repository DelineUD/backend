export const transformPhoneNumber = (value: string): string => {
  const phone = String(value).trim();

  if (phone.startsWith('7') && phone.length === 11) {
    return `+${phone}`;
  } else if (phone.startsWith('9') && phone.length === 10) {
    return `+7${phone}`;
  } else if (phone.startsWith('8') && phone.length === 11) {
    return `+7${phone.substring(1)}`;
  } else {
    return phone;
  }
};
