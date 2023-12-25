export function filterQueries(query: Record<string, any>): Record<string, any> {
  return Object.fromEntries(
    Object.entries(query).filter(([, value]) => {
      if (typeof value === 'boolean') {
        return value;
      }

      if (typeof value === 'string') {
        return value.trim() !== '';
      }

      if (Array.isArray(value)) {
        return value.length > 0;
      }

      return value !== null && typeof value !== 'undefined';
    }),
  );
}
