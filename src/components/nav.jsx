import { useEffect, useRef, useState } from 'react'

export default function Nav({projects = [],  activeProject, setActiveProject}) {
  const [isHeaderOpen, setIsHeaderOpen] = useState(false)
  const [isProjectsOpen, setIsProjectsOpen] = useState(false)
  const [isLensOpen, setIsLensOpen] = useState(false)
  const navRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!navRef.current) return
      if (!navRef.current.contains(event.target)) {
        setIsHeaderOpen(false)
        setIsProjectsOpen(false)
        setIsLensOpen(false)
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
          <li><button className="nav__link muted">About</button></li>
          <li><button className="nav__link muted">Contact</button></li>
        </ul>
      </div>

      <ul className="nav__list nav-items">
        <li className={`nav__group nav-items__parent ${isProjectsOpen ? 'is-open' : ''}`}>
          <button
            className="nav__toggle"
            aria-expanded={isProjectsOpen}
            aria-controls="nav-items-dropdown"
            onClick={() => setIsProjectsOpen((open) => !open)}
          >
            {projects.find((p) => p.slug === activeProject)?.name || 'Projects'}
          </button>
          <ul id="nav-items-dropdown" className="nav__dropdown">
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

      <ul className="nav__list nav-lens-items">
        <li className={`nav__group nav-lens__parent ${isLensOpen ? 'is-open' : ''}`}>
          <button
            className="nav__toggle"
            aria-expanded={isLensOpen}
            aria-controls="nav-lens-dropdown"
            onClick={() => setIsLensOpen((open) => !open)}
          >
            35mm
          </button>
          <ul id="nav-lens-dropdown" className="nav__dropdown">
            <li><button className="nav__link muted">28mm</button></li>
            <li><button className="nav__link muted">105mm</button></li>
          </ul>
        </li>
      </ul>
    </nav>
  )
}
