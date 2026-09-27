import {defineConfig} from 'sanity'
import {structureTool} from 'sanity/structure'
import {visionTool} from '@sanity/vision'
import {DocumentsIcon} from '@sanity/icons/Documents'
import {EditIcon} from '@sanity/icons/Edit'
import {schemaTypes} from './schemaTypes'
import {CategoryPosts} from './structure/CategoryPosts'

export default defineConfig({
  name: 'default',
  title: 'Kedaipal Blog',

  projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'cvycqoxz',
  dataset: process.env.SANITY_STUDIO_DATASET || 'production',

  plugins: [
    structureTool({
      structure: (S) =>
        S.list()
          .title('Content')
          .items([
            S.documentTypeListItem('post').title('Posts'),
            S.divider(),
            S.documentTypeListItem('category').title('Categories'),
            S.documentTypeListItem('author').title('Authors'),
          ]),
      // Categories open on a list of their posts, with the fields on an "Edit" tab
      defaultDocumentNode: (S, {schemaType}) =>
        schemaType === 'category'
          ? S.document().views([
              S.view.component(CategoryPosts).title('Posts').icon(DocumentsIcon),
              S.view.form().title('Edit').icon(EditIcon),
            ])
          : S.document(),
    }),
    visionTool(),
  ],

  schema: {types: schemaTypes},
})
