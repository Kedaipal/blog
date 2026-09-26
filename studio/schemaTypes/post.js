import {defineArrayMember, defineField, defineType} from 'sanity'
import {DocumentTextIcon} from '@sanity/icons/DocumentText'
import {BulbOutlineIcon} from '@sanity/icons/BulbOutline'

export default defineType({
  name: 'post',
  title: 'Post',
  type: 'document',
  icon: DocumentTextIcon,
  fieldsets: [
    {
      name: 'noImage',
      title: 'Cover when there is no image',
      description: 'Only used if no cover image is uploaded above.',
      options: {collapsible: true, collapsed: true},
    },
  ],
  fields: [
    defineField({
      name: 'title',
      type: 'string',
      validation: (r) => r.required().max(110),
    }),
    defineField({
      name: 'slug',
      type: 'slug',
      description: 'The web address of the post. Click "Generate".',
      options: {source: 'title', maxLength: 96},
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'Cover image',
      type: 'image',
      description: 'Upload 1800 × 771 px (at least 1200 × 750). JPG or WebP under 200 KB. Click the crop icon to set the hotspot so the subject stays in view on cards.',
      options: {hotspot: true},
      fields: [
        defineField({
          name: 'alt',
          title: 'Alt text',
          type: 'string',
          description: 'Describe the image for screen readers and Google.',
        }),
      ],
    }),
    defineField({
      name: 'excerpt',
      title: 'Summary',
      type: 'text',
      rows: 3,
      description: 'One or two sentences. Shown on cards, under the title and in search results.',
      validation: (r) => r.required().max(220),
    }),
    defineField({
      name: 'category',
      type: 'reference',
      to: [{type: 'category'}],
      validation: (r) => r.required(),
    }),
    defineField({name: 'author', type: 'reference', to: [{type: 'author'}]}),
    defineField({
      name: 'publishedAt',
      title: 'Publish date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
      validation: (r) => r.required(),
    }),
    defineField({
      name: 'featured',
      title: 'Feature on blog home',
      type: 'boolean',
      description: 'Shows this post in the large slot at the top. If several are ticked, the newest wins.',
      initialValue: false,
    }),
    defineField({
      name: 'body',
      type: 'array',
      of: [
        defineArrayMember({
          type: 'block',
          styles: [
            {title: 'Normal', value: 'normal'},
            {title: 'Heading', value: 'h2'},
            {title: 'Subheading', value: 'h3'},
            {title: 'Quote', value: 'blockquote'},
          ],
          marks: {
            decorators: [
              {title: 'Bold', value: 'strong'},
              {title: 'Italic', value: 'em'},
              {title: 'Code', value: 'code'},
            ],
          },
        }),
        defineArrayMember({
          type: 'image',
          title: 'Image',
          description: 'Shown full width in the article. Upload at least 1400 px wide.',
          options: {hotspot: true},
          fields: [
            defineField({name: 'alt', title: 'Alt text', type: 'string'}),
            defineField({name: 'caption', type: 'string', description: 'Optional, shown under the image.'}),
          ],
        }),
        defineArrayMember({
          name: 'callout',
          title: 'Tip box',
          type: 'object',
          icon: BulbOutlineIcon,
          fields: [
            defineField({name: 'label', type: 'string', initialValue: 'Tip'}),
            defineField({name: 'text', type: 'text', rows: 3, validation: (r) => r.required()}),
          ],
          preview: {select: {title: 'label', subtitle: 'text'}},
        }),
        defineArrayMember({
          name: 'divider',
          title: 'Divider',
          type: 'object',
          fields: [defineField({name: 'style', type: 'string', hidden: true, initialValue: 'line'})],
          preview: {prepare: () => ({title: '——— Divider ———'})},
        }),
      ],
    }),
    defineField({
      name: 'coverText',
      title: 'Cover text',
      type: 'string',
      fieldset: 'noImage',
      description: 'Short, e.g. "Never lose an order."',
    }),
    defineField({
      name: 'coverStyle',
      title: 'Cover colour',
      type: 'string',
      fieldset: 'noImage',
      options: {
        list: [
          {title: 'Navy', value: 'navy'},
          {title: 'Light', value: 'light'},
          {title: 'Green', value: 'green'},
        ],
        layout: 'radio',
        direction: 'horizontal',
      },
      initialValue: 'navy',
    }),
  ],
  orderings: [
    {title: 'Newest first', name: 'publishedDesc', by: [{field: 'publishedAt', direction: 'desc'}]},
  ],
  preview: {
    select: {title: 'title', category: 'category.title', date: 'publishedAt', media: 'mainImage'},
    prepare: ({title, category, date, media}) => ({
      title,
      subtitle: [category, date && new Date(date).toLocaleDateString('en-GB')].filter(Boolean).join(' · '),
      media,
    }),
  },
})
