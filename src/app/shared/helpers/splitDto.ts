export function splitDtoField(str: string, sep = ','): string[] {
  return str ? [...new Set(str.split(sep).map((el) => String(el).trim()))] : [];
}
