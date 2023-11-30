export function splitDtoField(str: string, sep = ','): string[] {
  return str ? str.split(sep).map((i) => i.trim()) : [];
}
