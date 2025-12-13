import { useMemo, useState } from 'react'
import Nav from './components/nav.jsx'
import Project from './components/project.jsx'
import { parseFrontmatter } from './utils/parseFrontMatter.js'

function App() {
  // load project metadata (json + md)
  const projects = useMemo(() => {
    const jsonModules = import.meta.glob('/content/projects/*.json', { eager: true })
    const mdModules = import.meta.glob('/content/projects/*.md', { eager: true, as: 'raw' })

    const fromJson = Object.values(jsonModules).map((mod) => mod.default ?? mod)
    const fromMd = Object.values(mdModules).map((raw) => parseFrontmatter(raw))

    return [...fromJson, ...fromMd]
      .filter((data) => data && (data.slug || data.name))
      .map((data) => ({
        slug: data.slug || data.name,
        name: data.name || data.slug || 'Untitled Project',
        description: data.description || '',
      }))
  }, [])

  // load images to determine which projects have content
  const images = useMemo(() => {
    const imageJsonModules = import.meta.glob('/content/images/*.json', { eager: true })
    const imageMdModules = import.meta.glob('/content/images/*.md', { eager: true, as: 'raw' })
    const fromJson = Object.values(imageJsonModules).map((mod) => mod.default ?? mod)
    const fromMd = Object.values(imageMdModules).map((raw) => parseFrontmatter(raw))
    return [...fromJson, ...fromMd]
  }, [])

  const nonEmptySlugs = useMemo(() => {
    const slugs = new Set()
    images.forEach((img) => {
      const collections = Array.isArray(img.collections) ? img.collections : []
      collections.forEach((c) => c && slugs.add(c))
    })
    return slugs
  }, [images])

  const visibleProjects = useMemo(
    () => projects.filter((p) => nonEmptySlugs.has(p.slug)),
    [projects, nonEmptySlugs],
  )

  //controls project active state
  const [activeProject, setActiveProject] = useState(() => {
    const hasStudio = visibleProjects.some((p) => p.slug === 'studio')
    if (hasStudio) return 'studio'
    return visibleProjects[0]?.slug || ''
  })

  return (
    <main className="App">
      <Nav
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        projects={visibleProjects}
      />
      <Project
        activeProject={activeProject}
        setActiveProject={setActiveProject}
        projects={visibleProjects}
      />
    </main>
  )
}

export default App
