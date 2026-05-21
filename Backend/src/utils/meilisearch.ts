import { Meilisearch } from 'meilisearch'

const meilisearchHost =
  process.env.MEILISEARCH_URL ??
  (process.env.MEILI_HOST && process.env.MEILI_PORT
    ? `http://${process.env.MEILI_HOST}:${process.env.MEILI_PORT}`
    : undefined)

const meilisearchApiKey =
  process.env.MEILISEARCH_KEY ?? process.env.MEILI_MASTER_KEY

if (!meilisearchHost) {
  throw new Error(
    'Meilisearch host is not configured. Set MEILISEARCH_URL or MEILI_HOST/MEILI_PORT.',
  )
}

if (!meilisearchApiKey) {
  throw new Error(
    'Meilisearch API key is not configured. Set MEILISEARCH_KEY or MEILI_MASTER_KEY.',
  )
}

export const meili = new Meilisearch({
  host: meilisearchHost,
  apiKey: meilisearchApiKey,
})

