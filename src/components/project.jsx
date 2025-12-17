import ProjectImages from './projectImages.jsx'

export default function Project({ activeProject, activeTag, images = [] }) {
  return <ProjectImages images={images} activeProject={activeProject} activeTag={activeTag} />
}
