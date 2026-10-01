/*
 * Sanity connection settings.
 * Paste the project ID from https://www.sanity.io/manage (same one as studio/.env).
 * While projectId is empty, the blog shows the sample posts from js/demo-data.js.
 */
window.SANITY_CONFIG = {
  projectId: 'opzqnhfl',
  dataset: 'production',
  apiVersion: '2025-02-19',
  useCdn: true, // fast cached reads; new posts appear within about a minute
};
