export const getImageUrl = (
  imageUrl: string | null | undefined,
): string | undefined => {
  if (!imageUrl) return undefined;

  if (imageUrl.startsWith("http://") || imageUrl.startsWith("https://")) {
    return imageUrl;
  }

  return `${import.meta.env.VITE_API_URL}/${imageUrl}`;
};
