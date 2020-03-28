import fetch from 'isomorphic-unfetch'
const token = process.env.REACT_APP_API_TOKEN

export default async function(...args) {
  const res = await fetch(...args, {
    headers: {
      Authorization: `Bearer ${token}`,
      'Content-Type': 'application/json',
    },
  })
  return res.json()
}
