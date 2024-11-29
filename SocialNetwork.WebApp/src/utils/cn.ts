import clsx, { ClassValue } from "clsx";

/**
 * Helper function for combining class names.
 * @param classes - A list of class names or conditions.
 * @returns A string with combined valid class names.
 */
const cn = (...classes: ClassValue[]): string => clsx(...classes);

export default cn;