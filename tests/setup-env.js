// Scrub ambient HONCHO_* env vars before tests run: the agent shell carries
// live plugin config (HONCHO_API_KEY, HONCHO_URL, ...) that would otherwise
// override the mocked/file config the tests set up. Restore at exit.
const originals = new Map()
for (const key of Object.keys(process.env)) {
  if (key.startsWith("HONCHO_")) {
    originals.set(key, process.env[key])
    delete process.env[key]
  }
}

process.on("exit", () => {
  for (const [key, value] of originals) {
    process.env[key] = value
  }
})
