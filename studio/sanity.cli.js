import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  api: {
    projectId: process.env.SANITY_STUDIO_PROJECT_ID || 'opzqnhfl',
    dataset: process.env.SANITY_STUDIO_DATASET || 'production',
  },
  // Studio URL when deployed: https://kedaipal-blog.sanity.studio
  //
  // ⚠️ BOTH VALUES BELOW STILL BELONG TO THE OLD PROJECT (cvycqoxz).
  // `projectId` above now points at opzqnhfl, but this studioHost is already
  // taken by the old project's deployed Studio and this appId was issued for
  // it, so `sanity deploy` will conflict or fail until someone with Sanity
  // access reissues them against opzqnhfl. Left unchanged on purpose rather
  // than guessed — a wrong appId here would break Kris's working Studio.
  studioHost: 'kedaipal-blog',
  deployment: {
    appId: 'x79jk5pyg1xpkuuplx50rshe',
  },
})
