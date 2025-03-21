import { gql } from '@apollo/client'

const BOOK_DETAILS = gql`
   fragment BookDetails on Book {
       title 
         author {
             name
             id
         } 
         published 
         genres
         id
   }
`;

export const ALL_BOOKS = gql`
    query allBooks($author: String, $genre: String) {
         allBooks(author: $author, genre: $genre) { 
             ...BookDetails
         }
    }
    ${BOOK_DETAILS}
`

export const ALL_AUTHORS = gql`
    query {
         allAuthors {
             name
             bookCount
             born
             id
         }
    }
`

export const ME = gql`
    query {
         me {
             username
             favoriteGenre
         }
    }
`

export const CREATE_BOOK = gql`
mutation createBook($title: String!, $author: String!, $published: Int!, $genres: [String!]!) {
    addBook(
         title: $title,
         author: $author,
         published: $published,
         genres: $genres
    ) {
         title
         author {
             name
             id
         }
         id
         published
         genres
    }
}
`

export const EDIT_BIRTH = gql`
    mutation editBirth($name: String!, $setBorn: Int!) {
         editBirth(name: $name, setBorn: $setBorn) {
             name
             born
         }
    }
`

export const LOGIN = gql`
   mutation login($username: String!, $password: String!) {
      login(username: $username, password: $password)  {
         value
      }
   }
`
export const BOOK_ADDED = gql`
   subscription {
      bookAdded {
         ...BookDetails
      }
   }
   ${BOOK_DETAILS}
`;
