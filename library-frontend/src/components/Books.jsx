import { useQuery } from "@apollo/client";
import React, { useState } from "react";
import { ALL_BOOKS } from "../services/queries";

const Books = () => {
  const [genre, setGenre] = useState("");

  const result = useQuery(ALL_BOOKS, {
    pollInterval: 2000,
  });

  if (result.loading) {
    return <div>Loading...</div>;
  }

  const books = genre
    ? result.data.allBooks.filter((book) => book.genres.includes(genre))
    : result.data.allBooks;

  return (
    <div>
      <h2>books</h2>

      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {books?.map((a) => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <button onClick={() => setGenre("refactoring")}>
      refactoring
      </button>
      <button onClick={() => setGenre("agile")}>
      agile
      </button>
      <button onClick={() => setGenre("patterns")}>
      patterns
      </button>
      <button onClick={() => setGenre("design")}>
      design
      </button>
      <button onClick={() => setGenre("crime")}>
      crime
      </button>
      <button onClick={() => setGenre("classic")}>
      classic
      </button>
      <button onClick={() => setGenre(null)}>
      all genres
      </button>
    </div>
  );
};

export default Books;
