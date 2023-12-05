export function filterQueries(query: Record<string, string | string[] | boolean>) {
  return Object.fromEntries(
    Object.entries(query).filter(([_, value]) => (typeof value === 'boolean' ? value : value.length)),
  );
}
