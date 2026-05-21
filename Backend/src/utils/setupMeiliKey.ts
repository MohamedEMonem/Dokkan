// scripts/generateSearchKey.ts  → run this ONCE manually
import { meili } from '../utils/meilisearch.js'

const { results } = await meili.getKeys()
const exists = results.find(k => k.description === 'Search only key')

if (exists) {
    console.log('Search key already exists:', exists.key)
} else {
    const searchKey = await meili.createKey({
        description: 'Search only key',
        actions: ['search'],
        indexes: ['products'],
        expiresAt: null
    })
    console.log('Copy this into your .env as MEILI_SEARCH_KEY:')
    console.log(searchKey.key)
}