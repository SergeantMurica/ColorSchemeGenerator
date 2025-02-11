// A helper function to sanitize a role name (convert to lower-case and replace spaces with dashes)
export const sanitizeName = (name: string): string => name.toLowerCase().replace(/\s+/g, '-');