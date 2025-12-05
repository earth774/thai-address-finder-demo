export function dirname() {
  return ''
}

export function join(...parts: string[]) {
  return parts.filter(Boolean).join('/')
}

export default {
  dirname,
  join,
}

