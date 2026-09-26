import {defineField, defineType} from 'sanity'
import {UserIcon} from '@sanity/icons/User'

export default defineType({
  name: 'author',
  title: 'Author',
  type: 'document',
  icon: UserIcon,
  fields: [
    defineField({name: 'name', type: 'string', validation: (r) => r.required()}),
    defineField({name: 'role', type: 'string', description: 'e.g. "Seller success"'}),
    defineField({
      name: 'image',
      title: 'Photo',
      type: 'image',
      description: 'Square, at least 200 × 200 px. Initials are shown if empty.',
      options: {hotspot: true},
    }),
  ],
  preview: {select: {title: 'name', subtitle: 'role', media: 'image'}},
})
