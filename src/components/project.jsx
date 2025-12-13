import { parseFrontmatter } from '../utils/parseFrontMatter.js'

// images glob (json + md frontmatter)
const imageJsonModules = import.meta.glob('/content/images/*.json', { eager: true });
const imageMdModules = import.meta.glob('/content/images/*.md', { eager: true, as: 'raw' });

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

export default function Project({activeProject}) {
    // Filter images by collection instead of tags
    const visible = normalizedImages.filter((img) =>
        img.collections?.includes(activeProject)
    );

    return (
        <div className="project-images">
            <div className="project-images-bleed">
                <div className="project-images-carousel">
                    {visible.map((img) => (
                        <figure key={img.image}
                        className="project-figure hoverable">
                            <img src={img.image} alt={img.alt} className="project-image"/>
                        </figure>
                    ))}
                </div>
            </div>
        </div> 
    )
}
