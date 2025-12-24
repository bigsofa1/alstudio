import ProjectImages from './projectImages.jsx'

export default function Project({
  activeProject,
  activeTag,
  tags = [],
  projects = [],
  images = [],
  isGridView,
  setIsGridView,
  setActiveProject,
  setActiveTag,
}) {
  return (
    <ProjectImages
      images={images}
      activeProject={activeProject}
      activeTag={activeTag}
      tags={tags}
      projects={projects}
      isGridView={isGridView}
      setIsGridView={setIsGridView}
      setActiveProject={setActiveProject}
      setActiveTag={setActiveTag}
    />
  )
}
