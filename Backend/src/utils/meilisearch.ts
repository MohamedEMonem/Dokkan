import { Meilisearch } from 'meilisearch'
const meilisearchHost =
  process.env.MEILISEARCH_URL ??
  (process.env.MEILI_HOST && process.env.MEILI_PORT
    ? `http://${process.env.MEILI_HOST}:${process.env.MEILI_PORT}`
    : undefined)

if (!meilisearchHost) {
  throw new Error(
    'Meilisearch host is not configured. Set MEILISEARCH_URL or MEILI_HOST/MEILI_PORT.',
  )
}

const masterKey = process.env.MEILI_MASTER_KEY

if (!masterKey) {
  throw new Error(
    'Meilisearch master key is not configured. Set MEILI_MASTER_KEY.',
  )
}
const searchKey = process.env.MEILI_SEARCH_KEY

if (!searchKey) {
  throw new Error(
    'Meilisearch search key is not configured. Set MEILI_SEARCH_KEY.',
  )
}

// full access — for add, update, delete, seed
export const meili = new Meilisearch({
  host: meilisearchHost,
  apiKey: masterKey,
})

// search only — for search endpoint
export const meilisearch = new Meilisearch({
  host: meilisearchHost,
  apiKey: searchKey,
})