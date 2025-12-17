import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'imageAsset',
  title: 'Image',
  type: 'document',
  fields: [
    defineField({name: 'image', title: 'Image', type: 'image', options: {hotspot: true}}),
    defineField({name: 'url', title: 'External URL', type: 'url'}),
    defineField({name: 'alt', title: 'Alt Text', type: 'string'}),
    defineField({
      name: 'tags',
      title: 'Tags',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'tag'}]}],
    }),
    defineField({
      name: 'collections',
      title: 'Collections (projects)',
      type: 'array',
      of: [{type: 'reference', to: [{type: 'project'}]}],
    }),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
})
