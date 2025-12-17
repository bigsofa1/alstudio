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

export const imagesQuery = groq`*[_type == "imageAsset"] | order(order asc, _createdAt desc) {
  "image": coalesce(image.asset->url, url),
  alt,
  "tags": tags[]->slug.current,
  "collections": collections[]->slug.current,
  order
}`
