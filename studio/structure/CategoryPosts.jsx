import {useCallback, useEffect, useState} from 'react'
import {Box, Card, Flex, Spinner, Stack, Text} from '@sanity/ui'
import {Preview, useClient, useSchema} from 'sanity'
import {useRouter} from 'sanity/router'

// Posts (published and drafts) that reference this category, newest first
const FILTER = `*[_type == "post" && category._ref == $id]`
const QUERY = `${FILTER} | order(publishedAt desc){_id}`

// Draft and published copies share an ID once "drafts." is stripped; show each post once
const uniquePosts = (docs) => {
  const seen = new Map()
  for (const {_id} of docs) {
    const id = _id.replace(/^drafts\./, '')
    const entry = seen.get(id) || {id, draft: false, published: false}
    if (_id.startsWith('drafts.')) entry.draft = true
    else entry.published = true
    seen.set(id, entry)
  }
  return [...seen.values()]
}

// "Posts" tab on a category: lists its posts; click one to open it
export function CategoryPosts({documentId, document}) {
  const client = useClient({apiVersion: '2025-02-19'})
  const postType = useSchema().get('post')
  const {navigateIntent} = useRouter()
  const [posts, setPosts] = useState(null)

  const load = useCallback(
    () => client.fetch(QUERY, {id: documentId}).then((docs) => setPosts(uniquePosts(docs))),
    [client, documentId],
  )

  useEffect(() => {
    load()
    // Refresh when a post is added to, moved out of, or edited in this category
    const sub = client.listen(FILTER, {id: documentId}, {visibility: 'query'}).subscribe(() => load())
    return () => sub.unsubscribe()
  }, [client, documentId, load])

  if (!document.displayed?.title) {
    return (
      <Box padding={4}>
        <Text muted>New category: fill it in on the Edit tab first.</Text>
      </Box>
    )
  }

  if (!posts) {
    return (
      <Flex justify="center" padding={5}>
        <Spinner muted />
      </Flex>
    )
  }

  return (
    <Stack padding={4} space={4}>
      <Text size={1} muted>
        {posts.length === 0
          ? 'No posts in this category yet.'
          : `${posts.length} post${posts.length === 1 ? '' : 's'} in ${document.displayed.title}`}
      </Text>
      <Stack space={2}>
        {posts.map((post) => (
          <Card
            key={post.id}
            as="button"
            radius={2}
            padding={2}
            border
            onClick={() => navigateIntent('edit', {id: post.id, type: 'post'})}
            style={{textAlign: 'left', cursor: 'pointer'}}
          >
            <Flex align="center" gap={3}>
              <Box flex={1}>
                <Preview schemaType={postType} value={{_id: post.published ? post.id : `drafts.${post.id}`, _type: 'post'}} layout="default" />
              </Box>
              {!post.published && (
                <Text size={1} muted>
                  Draft
                </Text>
              )}
            </Flex>
          </Card>
        ))}
      </Stack>
    </Stack>
  )
}
