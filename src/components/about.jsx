import { PortableText } from '@portabletext/react'

export default function About({ content = [], links = [] }) {
  if (!content || content.length === 0) return null

  return (
    <div className="about border-top">
      <div className="about__content">
        <PortableText value={content} />
      </div>
      {Array.isArray(links) && links.length > 0 && (
        <div className="about__links">
          <ul>
            {links.map((link) => (
              <li className="border-bottom" key={link._id || link.url}>
                <a className="hoverable" href={link.url} target="_blank" rel="noreferrer">
                  {link.name || link.url}
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}
