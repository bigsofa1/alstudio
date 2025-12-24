const socialLink = {
  name: 'socialLink',
  title: 'Social Link',
  type: 'document',
  fields: [
    {
      name: 'name',
      title: 'Name',
      type: 'string',
      validation: (Rule: any) => Rule.required(),
    },
    {
      name: 'url',
      title: 'URL',
      type: 'url',
      validation: (Rule: any) => Rule.required().uri({ allowRelative: false }),
    },
  ],
}

export default socialLink
