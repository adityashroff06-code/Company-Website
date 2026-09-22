import { clsx, type ClassValue } from "clsx"
import { extendTailwindMerge } from "tailwind-merge"

/**
 * tailwind-merge does not know the design-system type scale declared in index.css (@theme), so
 * out of the box it reads `text-body` or `text-eyebrow` as a colour and drops it whenever a real
 * colour such as `text-primary` follows. Register the scale as font sizes.
 */
const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      "font-size": [
        { text: ["display-1", "display-2", "title-1", "title-2", "body-lg", "body", "caption", "eyebrow"] },
      ],
    },
  },
})

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
