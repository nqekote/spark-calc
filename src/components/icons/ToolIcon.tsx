import { toolIcons } from './toolIcons'

interface ToolIconProps {
  name: string
  size?: number
  className?: string
  style?: React.CSSProperties
}

/**
 * Renders a tool icon by string key.
 * Falls back to displaying the raw string (old emoji) if key not found.
 */
export default function ToolIcon({ name, size = 24, className, style }: ToolIconProps) {
  const Icon = toolIcons[name]
  if (!Icon) {
    return (
      <span style={{ fontSize: size, lineHeight: 1, ...style }} className={className}>
        {name}
      </span>
    )
  }
  return <Icon width={size} height={size} className={className} style={style} />
}
