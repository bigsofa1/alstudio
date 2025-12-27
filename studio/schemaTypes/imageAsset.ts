import {defineField, defineType} from 'sanity'
import {orderRankField, orderRankOrdering} from '@sanity/orderable-document-list'

export default defineType({
  name: 'imageAsset',
  title: 'Image',
  type: 'document',
  fields: [
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({
      name: 'caption',
      title: 'Caption',
      type: 'text',
      rows: 2,
      description: 'Optional caption to display with the image.',
    }),
    defineField({name: 'alt', title: 'Alt Text', type: 'string', description: 'Important for SEO and accessibility.'}),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    orderRankField({type: 'imageAsset'}),
  ],
  orderings: [orderRankOrdering],
  preview: {
    select: {
      title: 'alt',
      subtitle: 'collections.0.name',
      media: 'image',
    },
  },
})
