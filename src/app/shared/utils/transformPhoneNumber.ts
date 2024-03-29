export const transformPhoneNumber = (value: string): string => {
  const phone = String(value).trim();

  if (phone.startsWith('7')) {
    return `+${phone}`;
  } else if (phone.startsWith('9') && phone.length === 10) {
    return `+7${phone}`;
  } else if (phone.startsWith('8')) {
    return phone.replace('8', '+7');
  }

  return phone;
};
