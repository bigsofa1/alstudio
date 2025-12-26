import { useRef} from 'react'

export default function Nav({
  onSelectAbout,
  onSelectProjects,
  view,
  setActiveProject,
  setActiveTag,
}) {
  const navRef = useRef(null)


  return (
    <nav className="nav" ref={navRef}>
      <button
        className="nav__brand frosted"
        onClick={() => {
          setActiveProject?.('')
          setActiveTag?.('')
          onSelectProjects?.()
        }}
      >
        <h1 className="nav__brand-text">Alexia Lachance</h1>
      </button>
      <div className="nav__sections frosted">
        <button
          className={`nav__link ${view === 'projects' ? '' : 'muted'}`}
          onClick={onSelectProjects}
        >
          Projects
        </button>
        <button
          className={`nav__link ${view === 'about' ? '' : 'muted'}`}
          onClick={onSelectAbout}
        >
          About
        </button>
      </div>
    </nav>
  )
}
