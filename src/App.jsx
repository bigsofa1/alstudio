import { useMemo, useState } from 'react'
import Nav from './components/nav.jsx'
import Project from './components/project.jsx'
import About from './components/about.jsx'
import { parseFrontmatter } from './utils/parseFrontMatter.js'

function App() {
  const [view, setView] = useState('projects')
  const [activeTag, setActiveTag] = useState('')
  // load project metadata (json + md)
  const projects = useMemo(() => {
    const jsonModules = import.meta.glob('/content/projects/*.json', { eager: true })
    const mdModules = import.meta.glob('/content/projects/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    })

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
    const imageMdModules = import.meta.glob('/content/images/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    })
    const fromJson = Object.values(imageJsonModules).map((mod) => mod.default ?? mod)
    const fromMd = Object.values(imageMdModules).map((raw) => parseFrontmatter(raw))
    return [...fromJson, ...fromMd]
  }, [])

  // load tag definitions (json + md)
  const tagsCollection = useMemo(() => {
    const tagJson = import.meta.glob('/content/tags/*.json', { eager: true })
    const tagMd = import.meta.glob('/content/tags/*.md', {
      eager: true,
      query: '?raw',
      import: 'default',
    })
    const fromJson = Object.values(tagJson).map((mod) => mod.default ?? mod)
    const fromMd = Object.values(tagMd).map((raw) => parseFrontmatter(raw))
    return [...fromJson, ...fromMd]
      .filter((t) => t && (t.slug || t.name))
      .map((t) => ({
        slug: t.slug || t.name,
        name: t.name || t.slug || 'Untitled Tag',
      }))
  }, [])

  const tagLabelMap = useMemo(() => {
    const map = new Map()
    tagsCollection.forEach((t) => map.set(t.slug, t.name))
    return map
  }, [tagsCollection])

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
  const [activeProject, setActiveProject] = useState('')
  const effectiveActiveProject = useMemo(() => {
    if (!visibleProjects.length) return ''
    if (visibleProjects.some((p) => p.slug === activeProject)) return activeProject
    const hasStudio = visibleProjects.some((p) => p.slug === 'studio')
    return hasStudio ? 'studio' : visibleProjects[0].slug
  }, [visibleProjects, activeProject])

  const tagsForActiveProject = useMemo(() => {
    if (!effectiveActiveProject) return []
    const available = new Set()
    images.forEach((img) => {
      if (Array.isArray(img.collections) && img.collections.includes(effectiveActiveProject)) {
        (img.tags || []).forEach((t) => t && available.add(t))
      }
    })
    return tagsCollection.filter((tag) => available.has(tag.slug))
  }, [images, effectiveActiveProject, tagsCollection])

  if (activeTag && !tagsForActiveProject.some((t) => t.slug === activeTag)) {
    setActiveTag('')
  }

  return (
    <main className="App">
      <Nav
        activeProject={effectiveActiveProject}
        setActiveProject={setActiveProject}
        projects={visibleProjects}
        view={view}
        tags={tagsForActiveProject}
        activeTag={activeTag}
        setActiveTag={setActiveTag}
        onSelectAbout={() => setView('about')}
        onSelectProjects={() => setView('projects')}
      />
      {view === 'about' ? (
        <About />
      ) : (
        <Project
          activeProject={effectiveActiveProject}
          activeTag={activeTag}
          setActiveProject={setActiveProject}
          projects={visibleProjects}
        />
      )}
    </main>
  )
}

export default App
