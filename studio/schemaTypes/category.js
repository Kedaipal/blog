import {defineField, defineType} from 'sanity'
import {TagIcon} from '@sanity/icons/Tag'

export default defineType({
  name: 'category',
  title: 'Category',
  type: 'document',
  icon: TagIcon,
  fields: [
    defineField({name: 'title', type: 'string', validation: (r) => r.required()}),
    defineField({
      name: 'slug',
      type: 'slug',
      options: {source: 'title'},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'order',
      title: 'Order in filter bar',
      type: 'number',
      description: 'Lower numbers appear first.',
    }),
  ],
  orderings: [{title: 'Filter order', name: 'order', by: [{field: 'order', direction: 'asc'}]}],
})
