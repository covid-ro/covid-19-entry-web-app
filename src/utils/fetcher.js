import fetch from 'isomorphic-unfetch'

export default async function (...args) {
  const res = await fetch(...args, {
    headers: {
      'X-API-KEY': process.env.REACT_APP_API_KEY,
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    },
  })
  return res.json()
}
