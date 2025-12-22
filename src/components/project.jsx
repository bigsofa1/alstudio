import ProjectImages from './projectImages.jsx'

export default function Project({
  activeProject,
  activeTag,
  images = [],
  isGridView,
  setIsGridView,
  showFilters,
  setShowFilters,
}) {
  return (
    <ProjectImages
      images={images}
      activeProject={activeProject}
      activeTag={activeTag}
      isGridView={isGridView}
      setIsGridView={setIsGridView}
      showFilters={showFilters}
      setShowFilters={setShowFilters}
    />
  )
}
