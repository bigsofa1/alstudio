import {defineField, defineType} from 'sanity'

export default defineType({
  name: 'project',
  title: 'Project',
  type: 'document',
  fields: [
    defineField({name: 'name', title: 'Name', type: 'string', validation: r => r.required()}),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: {source: 'name', maxLength: 96, slugify: v => v.toLowerCase().trim().replace(/\s+/g, '-')},
      validation: r => r.required(),
    }),
    defineField({name: 'description', title: 'Description', type: 'text'}),
    defineField({name: 'order', title: 'Order', type: 'number'}),
  ],
})
