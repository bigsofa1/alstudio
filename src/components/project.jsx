import { parseFrontmatter } from '../utils/parseFrontMatter.js'
import ProjectImages from './projectImages.jsx'

// images glob (json + md frontmatter)
const imageJsonModules = import.meta.glob('/content/images/*.json', { eager: true });
const imageMdModules = import.meta.glob('/content/images/*.md', { eager: true, query: '?raw', import: 'default' });

const images = [
  ...Object.values(imageJsonModules).map((mod) => mod.default ?? mod),
  ...Object.values(imageMdModules).map((raw) => parseFrontmatter(raw)),
];


// taking globs, then normalizing image paths
const base = (import.meta.env.BASE_URL || '/').replace(/\/$/, '')

const normalizedImages = images.map((img) => {
  const raw = img.image || ''
  const path = raw.startsWith('http')
    ? raw
    : `${base}${raw.startsWith('/') ? raw : `/${raw}`}`
  return {
    ...img,
    image: path,
    collections: Array.isArray(img.collections) ? img.collections : [],
  }
})

export default function Project({ activeProject }) {
  return <ProjectImages images={normalizedImages} activeProject={activeProject} />
}
