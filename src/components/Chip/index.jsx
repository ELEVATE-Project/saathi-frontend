// ─── Variant colour sets ─────────────────────────────────────────────────────
const VARIANT_CLASSES = {
  default: "bg-[hsl(0,0%,95.42%)] border-slate-300 text-slate-700 hover:border-slate-400 hover:bg-[hsl(0,0%,91%)]",
  primary: "bg-white border-sky-200   text-sky-800   hover:border-sky-400   hover:bg-sky-50",
  success: "bg-white border-emerald-200 text-emerald-800 hover:border-emerald-400 hover:bg-emerald-50",
  warning: "bg-white border-amber-200  text-amber-800  hover:border-amber-400  hover:bg-amber-50",
  error:   "bg-white border-red-200    text-red-800    hover:border-red-400    hover:bg-red-50",
}

const SIZE_CLASSES = {
  sm: "text-sm    px-3   py-1.5 gap-1.5",
  md: "text-base  px-5   py-3   gap-2",
  lg: "text-lg    px-6   py-3.5 gap-2.5",
}

/**
 * Chip — pill-shaped label.
 *
 * Props
 * ─────
 * @param {string}    label           Text inside the chip (required)
 * @param {"default"|"primary"|"success"|"warning"|"error"} [variant="default"]
 * @param {"sm"|"md"|"lg"}  [size="md"]
 * @param {boolean}   [disabled=false]   Dims and blocks interaction
 * @param {function}  [onClick]          Makes the whole chip clickable
 * @param {ReactNode} [startIcon]        Element/emoji rendered before the label
 * @param {ReactNode} [endIcon]          Element rendered after the label
 * @param {string}    [className=""]     Extra Tailwind classes
 * @param {object}    [style]            Inline styles
 *
 * Usage examples
 * ──────────────
 * <Chip label="📚 Start a Student Reading Corner" />
 * <Chip label="Hindi"  variant="primary"  onClick={() => pick("hi")} />
 * <Chip label="REC"    variant="error"    size="sm" startIcon={<FaCircle />} />
 */
const Chip = ({
  label,
  variant = "primary",
  size = "md",
  disabled = false,
  onClick,
  startIcon,
  endIcon,
  className = "",
  style,
  ...rest
}) => {
  const isClickable = !disabled && typeof onClick === "function"

  const baseClasses = [
    // shape & layout
    "inline-flex items-center rounded-full border font-bold",
    "whitespace-nowrap select-none transition-colors duration-150",
    // colour variant
    VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.default,
    // size (includes shadow)
    SIZE_CLASSES[size] ?? SIZE_CLASSES.md,
    // clickable
    isClickable
      ? "cursor-pointer active:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-sky-500"
      : "cursor-default",
    // disabled
    disabled ? "opacity-45 pointer-events-none" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ")

  return (
    <span
      className={baseClasses}
      style={style}
      onClick={isClickable ? onClick : undefined}
      role={isClickable ? "button" : undefined}
      tabIndex={isClickable ? 0 : undefined}
      onKeyDown={
        isClickable
          ? (e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault()
                onClick(e)
              }
            }
          : undefined
      }
      aria-disabled={disabled || undefined}
      {...rest}
    >
      {startIcon && (
        <span className="inline-flex items-center shrink-0">{startIcon}</span>
      )}

      {label}

      {endIcon && (
        <span className="inline-flex items-center shrink-0">{endIcon}</span>
      )}
    </span>
  )
}

export default Chip
