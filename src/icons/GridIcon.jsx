export default function GridIcon({ size = 18, className, ...props }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 300 300"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-hidden="true"
      focusable="false"
      {...props}
    >
      <rect x="18.35" y="18.35" width="112.53" height="112.53" fill="currentColor" />
      <rect x="169.12" y="18.35" width="112.53" height="112.53" fill="currentColor" />
      <rect x="169.12" y="169.12" width="112.53" height="112.53" fill="currentColor" />
      <rect x="18.35" y="169.12" width="112.53" height="112.53" fill="currentColor" />
    </svg>
  )
}
