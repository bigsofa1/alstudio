import groq from 'groq'

export const projectsQuery = groq`*[_type == "project"] | order(order asc, name asc) {
  "slug": coalesce(slug.current, name),
  name,
  description
}`

export const tagsQuery = groq`*[_type == "tag"] | order(name asc) {
  "slug": coalesce(slug.current, name),
  name
}`

export const imagesQuery = groq`*[_type == "imageAsset"] | order(coalesce(date, _createdAt) desc, order asc, _createdAt desc) {
  _id,
  image{
    ...,
    asset->{
      _id,
      url,
      metadata{
        dimensions
      }
    }
  },
  "fallbackUrl": coalesce(image.asset->url, url),
  alt,
  "tags": tags[]->slug.current,
  "collections": collections[]->slug.current,
  order,
  date
}`
