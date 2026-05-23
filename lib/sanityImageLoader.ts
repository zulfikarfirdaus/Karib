export default function sanityImageLoader({
  src,
  width,
  quality,
}: {
  src: string
  width: number
  quality?: number
}) {
  if (src.startsWith('/') || src.startsWith('./')) return src;
  const url = new URL(src)
  url.searchParams.set('auto', 'format')
  url.searchParams.set('fit', 'max')
  url.searchParams.set('w', width.toString())
  url.searchParams.delete('h')
  if (quality) {
    url.searchParams.set('q', quality.toString())
  }
  return url.href
}
