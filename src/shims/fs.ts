export function existsSync() {
  return false
}

export function readFileSync() {
  throw new Error('fs.readFileSync is not available in the browser')
}

export default {
  existsSync,
  readFileSync,
}

