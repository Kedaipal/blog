import {useEffect, useState} from 'react'
import {Select} from '@sanity/ui'
import {set, unset, useClient} from 'sanity'

// Published categories only, in the same order as the blog's filter bar
const QUERY = `*[_type == "category" && !(_id in path("drafts.**"))] | order(order asc, title asc){_id, title}`

// Plain dropdown of existing categories for the post's category reference
export function CategorySelect({value, onChange, readOnly, elementProps}) {
  const client = useClient({apiVersion: '2025-02-19'})
  const [categories, setCategories] = useState(null)

  useEffect(() => {
    let active = true
    client.fetch(QUERY).then((result) => active && setCategories(result))
    return () => {
      active = false
    }
  }, [client])

  const handleChange = (event) => {
    const id = event.currentTarget.value
    onChange(id ? set({_type: 'reference', _ref: id}) : unset())
  }

  return (
    <Select
      {...elementProps}
      value={value?._ref || ''}
      onChange={handleChange}
      disabled={readOnly || !categories}
    >
      <option value="">{categories ? 'Choose a category…' : 'Loading categories…'}</option>
      {categories?.map((category) => (
        <option key={category._id} value={category._id}>
          {category.title}
        </option>
      ))}
    </Select>
  )
}
