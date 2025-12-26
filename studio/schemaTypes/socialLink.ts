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
      validation: (Rule: any) =>
        Rule.required().uri({
          allowRelative: false,
          scheme: ['http', 'https', 'mailto'],
        }),
    },
    {
      name: 'order',
      title: 'Order',
      type: 'number',
      description: 'Lower numbers appear first.',
      validation: (Rule: any) => Rule.min(0),
    },
  ],
}

export default socialLink
