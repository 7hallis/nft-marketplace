import { Slider as SliderPrimitive } from "@base-ui/react/slider"
import { cn } from "cn"

type SliderProps = SliderPrimitive.Root.Props & {
  getAriaLabel?: (index: number) => string
}

function Slider({
  className,
  defaultValue,
  value,
  min = 0,
  max = 100,
  getAriaLabel,
  ...props
}: SliderProps) {
  const _values = Array.isArray(value)
    ? value
    : Array.isArray(defaultValue)
      ? defaultValue
      : [min, max]

  return (
    <SliderPrimitive.Root
      className={cn("data-horizontal:w-full data-vertical:h-full", className)}
      data-slot="slider"
      defaultValue={defaultValue}
      value={value}
      min={min}
      max={max}
      thumbAlignment="edge"
      {...props}
    >
      <SliderPrimitive.Control className="relative flex w-full touch-none items-center select-none data-disabled:opacity-50">
        <SliderPrimitive.Track
          data-slot="slider-track"
          className="relative h-1 w-full grow overflow-hidden rounded-full bg-[#60432e] select-none"
          style={{ height: "4px", backgroundColor: "#60432e" }}
        >
          <SliderPrimitive.Indicator
            data-slot="slider-range"
            className="h-full bg-[#d28a4c] select-none"
            style={{ height: "100%", backgroundColor: "#d28a4c" }}
          />
        </SliderPrimitive.Track>
        {Array.from({ length: _values.length }, (_, index) => (
          <SliderPrimitive.Thumb
            data-slot="slider-thumb"
            key={index}
            getAriaLabel={getAriaLabel ? () => getAriaLabel(index) : undefined}
            className="relative block size-3.5 shrink-0 rounded-full border-2 border-[#21150f] bg-[#d28a4c] ring-[#e99a4a]/50 transition-[color,box-shadow] select-none after:absolute after:-inset-2 hover:ring-3 focus-visible:ring-3 focus-visible:outline-hidden active:ring-3 disabled:pointer-events-none disabled:opacity-50"
            style={{
              backgroundColor: "#d28a4c",
              borderColor: "#21150f",
            }}
          />
        ))}
      </SliderPrimitive.Control>
    </SliderPrimitive.Root>
  )
}

export { Slider }
