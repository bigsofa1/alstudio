import { useEffect, useRef, useState } from 'react'
import MenuIcon from '../icons/MenuIcon.jsx'
import MenuIconOpen from '../icons/MenuIconOpen.jsx'

export default function Nav({
  projects = [],
  activeProject,
  setActiveProject,
  tags = [],
  activeTag,
  setActiveTag,
  onSelectAbout,
  onSelectProjects,
  view,
}) {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isTagsOpen, setIsTagsOpen] = useState(false)
  const [showFilters, setShowFilters] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navRef.current) return
      if (!navRef.current.contains(event.target)) {
        setIsHeaderOpen(false)
        setIsProjectsOpen(false)
        setIsTagsOpen(false)
        setShowFilters(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])


  return (
    <nav className="nav" ref={navRef}>
      <div className={`nav__group nav-header ${isHeaderOpen ? 'is-open' : ''}`}>
        <button
          className="nav__toggle"
          aria-expanded={isHeaderOpen}
          aria-controls="nav-header-dropdown"
          onClick={() => setIsHeaderOpen((open) => !open)}
        >
          <h1>Alexia Lachance</h1>
        </button>
        <ul id="nav-header-dropdown" className="nav__dropdown">
          <li>
            <button
              className={`nav__link ${view === 'projects' ? '' : 'muted'}`}
              onClick={onSelectProjects}
            >
              Projects
            </button>
          </li>
          <li>
            <button
              className={`nav__link ${view === 'about' ? '' : 'muted'}`}
              onClick={onSelectAbout}
            >
              About
            </button>
          </li>
        </ul>
      </div>

      {view === 'projects' && (
        <>
          <button
            className="nav__menu-button"
            aria-label="Toggle filters"
            aria-pressed={showFilters}
            type="button"
            onClick={() => setShowFilters((open) => !open)}
          >
            {showFilters ? <MenuIconOpen /> : <MenuIcon />}
          </button>

          {showFilters && (
            <>
              <ul className="nav__list nav-items">
                <li className={`nav__group nav-items__parent ${isProjectsOpen ? 'is-open' : ''}`}>
                  <button
                    className="nav__toggle"
                  aria-expanded={isProjectsOpen}
                  aria-controls="nav-items-dropdown"
                  onClick={() => setIsProjectsOpen((open) => !open)}
                >
                    {activeProject
                      ? projects.find((p) => p.slug === activeProject)?.name || 'Projects'
                      : 'All'}
                </button>
                <ul id="nav-items-dropdown" className="nav__dropdown">
                    {activeProject && (
                      <li>
                        <button
                          onClick={() => setActiveProject('')}
                          className="nav__link muted"
                        >
                          All
                        </button>
                      </li>
                    )}
                  {projects
                    .filter((project) => project.slug !== activeProject)
                    .map((project) => (
                      <li key={project.slug}>
                        <button
                            onClick={() => setActiveProject(project.slug)}
                            className="nav__link muted"
                          >
                            {project.name}
                          </button>
                        </li>
                      ))}
                  </ul>
                </li>
              </ul>

              <ul className="nav__list nav-tags-items">
                <li className={`nav__group nav-tags__parent ${isTagsOpen ? 'is-open' : ''}`}>
                  <button
                    className="nav__toggle"
                    aria-expanded={isTagsOpen}
                    aria-controls="nav-tags-dropdown"
                    onClick={() => setIsTagsOpen((open) => !open)}
                  >
                    {tags.find((t) => t.slug === activeTag)?.name || 'All'}
                  </button>
                  {tags.length > 0 && (
                    <ul id="nav-tags-dropdown" className="nav__dropdown">
                      {tags
                      .filter((tag) => tag.slug !== activeTag)
                      .map((tag) => (
                        <li key={tag.slug}>
                          <button
                            className="nav__link muted"
                            onClick={() => setActiveTag(tag.slug)}
                          >
                            {tag.name}
                          </button>
                        </li>
                      ))}
                    {activeTag && (
                      <li>
                        <button
                          className="nav__link muted"
                          onClick={() => setActiveTag('')}
                        >
                          All
                        </button>
                      </li>
                    )}
                    </ul>
                  )}
                </li>
              </ul>
            </>
          )}
        </>
      )}
    </nav>
  )
}
