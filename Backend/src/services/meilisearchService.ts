import { meili,meilisearch } from '../utils/meilisearch.js'

export const meilisearchService = {

  add: async (index: string, doc: Record<string,unknown>) => {
    await meili.index(index).addDocuments([doc])
  },

  update: async (index: string, doc: Record<string,unknown>) => {
    await meili.index(index).updateDocuments([doc])
  },

  delete: async (index: string, id: string) => {
    await meili.index(index).deleteDocument(id)
  },

  search: async (index: string, query: string) => {
    try{
    return await meilisearch.index(index).search(query)
    }catch(error){ // fallback to master key if search key fails
      console.error('Search key failed, falling back to master key:', error)
      return await meili.index(index).search(query)
    }

  },
  seedMeilisearch: async (index: string, docs: Record<string, unknown>[]) => {
    await meili.index(index).addDocuments(docs)
  }
}