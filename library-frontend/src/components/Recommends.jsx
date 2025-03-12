import { useQuery } from '@apollo/client'
import React from 'react'
import { ALL_BOOKS, ME } from '../services/queries'

const Recommends = () => {
   const result = useQuery(ALL_BOOKS, {
      pollInterval: 2000
   })
   const user = useQuery(ME, {
      pollInterval: 2000
   })

   const favouriteGenre = user.data?.me?.favoriteGenre

   if(result.loading){
      return <div>loading...</div>
   }
   const books = result.data?.allBooks
   const recommendedBook = books.filter(book => book.genres.includes(favouriteGenre))

  return (
    <div>
      <h2>Recommendations</h2>
      books in your favorite genre <strong>{favouriteGenre}</strong>
      <table>
         <tbody>
            <tr>
               <th></th>
               <th>authors</th>
               <th>published</th>
            </tr>
            {recommendedBook.map(book =>
               <tr key={book.id}>
                  <td>{book.title}</td>
                  <td>{book.author.name}</td>
                  <td>{book.published}</td>
               </tr>
               )}
         </tbody>
      </table>
     
    </div>
  )
}

export default Recommends