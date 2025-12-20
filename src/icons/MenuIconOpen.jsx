export default function MenuIconOpen({ size = 18, className, ...props }) {
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
      <path d="M193.27,106.73v86.53h-86.53v-86.53h86.53M206.27,93.73h-112.53v112.53h112.53v-112.53h0Z" fill="currentColor"/>
    </svg>
  )
}
