import { createClient } from '@sanity/client'

const projectId = import.meta.env.VITE_SANITY_PROJECT_ID
const dataset = import.meta.env.VITE_SANITY_DATASET
const apiVersion = import.meta.env.VITE_SANITY_API_VERSION || '2024-01-01'
const useCdn = true

const missingConfig = !projectId || !dataset

export const sanityClient = missingConfig
  ? null
  : createClient({
      projectId,
      dataset,
      apiVersion,
      useCdn,
      perspective: 'published',
    })

export function fetchSanity(query, params = {}) {
  if (!sanityClient) {
    throw new Error('Missing Sanity configuration. Set VITE_SANITY_PROJECT_ID and VITE_SANITY_DATASET.')
  }
  return sanityClient.fetch(query, params)
}
