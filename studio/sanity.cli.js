import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'cvycqoxz',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio URL when deployed: https://kedaipal-blog.sanity.studio
  studioHost: 'kedaipal-blog',
  deployment: {
    appId: 'x79jk5pyg1xpkuuplx50rshe',
  },
})
