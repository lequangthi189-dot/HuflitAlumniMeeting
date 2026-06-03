export default function ProgressBar({ value = 0, className = '' }) {
  const v = Math.max(0, Math.min(100, value))
  return (
    <div className={`w-full h-2 rounded-full bg-panel2 overflow-hidden ${className}`}>
      <div
        className="h-full bg-gradient-to-r from-accent to-accent2 transition-all"
        style={{ width: `${v}%` }}
      />
    </div>
  )
}
