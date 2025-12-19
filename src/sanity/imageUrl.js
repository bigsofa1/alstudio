import imageUrlBuilder from '@sanity/image-url'
import { sanityClient } from './client.js'

const builder = sanityClient ? imageUrlBuilder(sanityClient) : null

export function buildImageUrl(source, options = {}) {
  if (!source) return ''

  const {
    width,
    height,
    quality = 85,
    fit = 'max',
    dpr = 1,
  } = options

  const fallbackUrl =
    typeof source === 'string' ? source : source?.asset?.url || source?.url || ''

  if (!builder) return fallbackUrl

  let image = builder.image(source).fit(fit).auto('format')

  if (width) image = image.width(Math.round(width * dpr))
  if (height) image = image.height(Math.round(height * dpr))
  if (quality) image = image.quality(quality)
  if (dpr && dpr !== 1) image = image.dpr(dpr)

  return image.url() || fallbackUrl
}
