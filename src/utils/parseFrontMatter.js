// Simple YAML-ish frontmatter parser for Decap markdown entries
export function parseFrontmatter(raw) {
  if (typeof raw !== 'string') return {}
  if (!raw.startsWith('---')) return {}
  const end = raw.indexOf('---', 3)
  if (end === -1) return {}
  const block = raw.slice(3, end).trim()
  const result = {}
  let currentKey = null
  block.split('\n').forEach((line) => {
    const arrayItem = line.match(/^\s*-\s+(.*)$/)
    if (arrayItem && currentKey) {
      if (!Array.isArray(result[currentKey])) result[currentKey] = []
      result[currentKey].push(arrayItem[1].trim().replace(/^"|"$/g, ''))
      return
    }
    const [key, ...rest] = line.split(':')
    if (!key) return
    const value = rest.join(':').trim()
    currentKey = key.trim()
    if (value) {
      result[currentKey] = value.replace(/^"|"$/g, '')
      currentKey = null
    } else {
      result[currentKey] = []
    }
  })
  return result
}
