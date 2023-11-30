export function groupDtoFields(dto: Record<string, any>, fields: string[]) {
  const getItemString = (dto: Record<string, any>, fieldName: string): string => {
    return dto[fieldName];
  };

  return fields.filter((field) => getItemString(dto, field)).map((field) => getItemString(dto, field));
}
