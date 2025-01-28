export default (key: string) => {
  const value = Deno.env.get(key);

  if (value === undefined) {
    throw new Error(`key "${key} is undefined"`);
  }

  return value;
};
