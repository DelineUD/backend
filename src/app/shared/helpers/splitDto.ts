export function splitDtoField(str: string, sep = ','): string[] {
  return str ? [...new Set(str.split(sep).map((i) => i.toString().trim()))] : [];
}
