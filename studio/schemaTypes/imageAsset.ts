import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageAsset',
  title: 'Image',
  type: 'document',
  fields: [
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
    defineField({
      name: 'date',
      title: 'Date',
      type: 'datetime',
      description: 'Use to sort images chronologically.',
    }),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    defineField({
      name: 'collections',
      title: 'Collections',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
  ],
})
