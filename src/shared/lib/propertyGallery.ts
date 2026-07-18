export function getPropertyGalleryThumbs(
  imageUrl: string,
  galleryUrls: string[],
  limit = 3,
): string[] {
  const unique: string[] = []

  for (const url of [imageUrl, ...galleryUrls]) {
    if (!unique.includes(url)) unique.push(url)
    if (unique.length >= limit) break
  }

  return unique
}
