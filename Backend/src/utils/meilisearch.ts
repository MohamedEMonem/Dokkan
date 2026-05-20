import { Meilisearch } from 'meilisearch'

export const meili = new Meilisearch({
  host: process.env.MEILISEARCH_URL!,
  apiKey: process.env.MEILISEARCH_KEY!
})

