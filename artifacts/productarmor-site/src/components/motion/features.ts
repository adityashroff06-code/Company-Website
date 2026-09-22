/**
 * Split point for framer-motion's animation features (~20 KB gz). MotionProvider imports this
 * lazily so the features become their own chunk and the entry stays under the §7 budget.
 */
export { domAnimation as default } from "framer-motion";
