import { useEffect, useMemo, useState } from 'react'
import Nav from './components/nav.jsx'
import Project from './components/project.jsx'
import About from './components/about.jsx'
import { fetchSanity } from './sanity/client.js'
import { imagesQuery, projectsQuery, tagsQuery } from './sanity/queries.js'

function App() {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [projects, setProjects] = useState([])
  const [images, setImages] = useState([])
  const [tagsCollection, setTagsCollection] = useState([])
  const [view, setView] = useState('projects')
  const [isGridView, setIsGridView] = useState(false)
  const [activeTag, setActiveTag] = useState('')

  useEffect(() => {
    let cancelled = false

    async function loadContent() {
      setLoading(true)
      setError(null)
      try {
        const [projData, imageData, tagData] = await Promise.all([
          fetchSanity(projectsQuery),
          fetchSanity(imagesQuery),
          fetchSanity(tagsQuery),
        ])
        if (cancelled) return
        setProjects(Array.isArray(projData) ? projData : [])
        setImages(
          Array.isArray(imageData)
            ? imageData.map((img) => ({
                ...img,
                image: img.image || '',
                collections: Array.isArray(img.collections) ? img.collections : [],
                tags: Array.isArray(img.tags) ? img.tags : [],
              }))
            : [],
        )
        setTagsCollection(Array.isArray(tagData) ? tagData : [])
      } catch (err) {
        if (!cancelled)
          setError(err instanceof Error ? err.message : 'Failed to load content from Sanity')
      } finally {
        if (!cancelled) setLoading(false)
      }
    }

    loadContent()
    return () => {
      cancelled = true
    }
  }, [])

  const hasInitialData = projects.length > 0 || images.length > 0 || tagsCollection.length > 0

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
    if (activeProject === '' || activeProject === 'all') return ''
    if (!visibleProjects.length) return ''
    if (visibleProjects.some((p) => p.slug === activeProject)) return activeProject
    const hasStudio = visibleProjects.some((p) => p.slug === 'studio')
    return hasStudio ? 'studio' : visibleProjects[0].slug
  }, [visibleProjects, activeProject])

  const tagsForActiveProject = useMemo(() => {
    if (!effectiveActiveProject) return tagsCollection
    const available = new Set()
    images.forEach((img) => {
      if (Array.isArray(img.collections) && img.collections.includes(effectiveActiveProject)) {
        (img.tags || []).forEach((t) => t && available.add(t))
      }
    })
    return tagsCollection.filter((tag) => available.has(tag.slug))
  }, [images, effectiveActiveProject, tagsCollection])

  useEffect(() => {
    if (activeTag && !tagsForActiveProject.some((t) => t.slug === activeTag)) {
      setActiveTag('')
    }
  }, [activeTag, tagsForActiveProject])

  if (error && !hasInitialData) {
    return (
      <main className="App">
        <p>Failed to load content from Sanity: {error}</p>
      </main>
    )
  }

  if (loading && !hasInitialData) {
    return null
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
          images={images}
          isGridView={isGridView}
          setIsGridView={setIsGridView}
          setActiveProject={setActiveProject}
          projects={visibleProjects}
        />
      )}
    </main>
  )
}

export default App
