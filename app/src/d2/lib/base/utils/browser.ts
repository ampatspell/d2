export const copyToClipboard = async (value: string | undefined) => {
  if (typeof value === 'string') {
    await navigator.clipboard.writeText(value);
  }
}
