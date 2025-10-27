import { ReactNode } from "react"

function BorderDiv({ children, className, borderSize, borderWidth }: {
  children: ReactNode,
  className?: string,
  borderSize: string,
  borderWidth: number
}) {
  return (
    <div className={`relative ${className}`}>
      {children}
      <div className={`absolute ${borderSize} top-0 left-0 ${borderWidth === 1 ? 'border-t border-l' : 'border-t-' + borderWidth + ' border-l-' + borderWidth} }`} />
      <div className={`absolute ${borderSize} top-0 right-0 ${borderWidth === 1 ? 'border-t border-r' : 'border-t-' + borderWidth + ' border-r-' + borderWidth} }`} />
      <div className={`absolute ${borderSize} bottom-0 left-0 ${borderWidth === 1 ? 'border-b border-l' : 'border-b-' + borderWidth + ' border-l-' + borderWidth} }`} />
      <div className={`absolute ${borderSize} bottom-0 right-0 ${borderWidth === 1 ? 'border-b border-r' : 'border-b-' + borderWidth + ' border-r-' + borderWidth} }`} />
    </div>
  )
}
export default BorderDiv
