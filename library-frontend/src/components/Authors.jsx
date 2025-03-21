import { useQuery } from "@apollo/client"
import React from "react"
import { ALL_AUTHORS, ALL_BOOKS } from "../services/queries"



const Authors = () => {
  const result = useQuery(ALL_AUTHORS, {
    pollInterval: 2000
  })

  if(result.loading){
    return <div>Loading...</div>
  }
  
  console.log(result)
  const authors = result.data?.allAuthors
  console.log(authors)

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors?.map((a) => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Authors
