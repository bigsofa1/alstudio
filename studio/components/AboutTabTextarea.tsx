import {TextArea} from '@sanity/ui'
import {set, unset} from 'sanity'

type Props = {
  value?: string
  onChange: (val: any) => void
  elementProps: React.TextareaHTMLAttributes<HTMLTextAreaElement>
}

export default function AboutTabTextarea({value = '', onChange, elementProps}: Props) {
  return (
    <TextArea
      {...elementProps}
      value={value}
      rows={6}
      onKeyDown={(event) => {
        if (event.key === 'Tab') {
          event.preventDefault()
          const el = event.currentTarget
          const {selectionStart, selectionEnd, value: current} = el
          const nextValue = current.slice(0, selectionStart) + '\t' + current.slice(selectionEnd)
          const nextPos = selectionStart + 1
          onChange(set(nextValue))
          requestAnimationFrame(() => {
            if (!el) return
            // Guard against unmount or loss of focus during async frame
            try {
              el.selectionStart = nextPos
              el.selectionEnd = nextPos
            } catch {
              /* ignore if element is gone or not focusable */
            }
          })
        }
      }}
      onChange={(event) => {
        const next = event.currentTarget.value
        onChange(next ? set(next) : unset())
      }}
    />
  )
}
