const extractText = (value) => {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) {
    // Handle Portable Text arrays by concatenating child text
    return value
      .map((block) =>
        Array.isArray(block?.children)
          ? block.children.map((child) => child?.text || '').join('')
          : '',
      )
      .filter(Boolean)
      .join('\n\n')
  }
  return ''
}

export default function About({ content = '' }) {
  const text = extractText(content)
  if (!text) return null

  return (
    <div className="about">
      <p>{text}</p>
    </div>
  )
}
