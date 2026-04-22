import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import * as BooksAPI from "../BooksAPI";
import Book from "./Book";

function Search({
  changeShelf,
  read,
  currentlyReading,
  wantToRead,
  searchTerm,
  setSearchTerm,
  debouncedSearchTerm,
}) {
  const [searchResult, setSearchResult] = useState([]);
  const [searchError, setSearchError] = useState(false);

  const checkBookExist = (books) => {
    const mainPageBooks = [...read, ...currentlyReading, ...wantToRead];

    if (books && books.length > 0) {
      const updatedBooks = books.map((b) => {
        const exist = mainPageBooks.find((mb) => mb.id === b.id);
        return exist ? { ...b, shelf: exist.shelf } : b;
      });

      setSearchResult(updatedBooks);
      setSearchError(false);
    } else {
      setSearchResult([]);
      setSearchError(true);
    }
  };

  // 👈 هنا السحر بتاع debounce
  useEffect(() => {
    if (debouncedSearchTerm) {
      BooksAPI.search(debouncedSearchTerm, 20).then((books) => {
        checkBookExist(books);
      });
    } else {
      setSearchResult([]);
    }
  }, [debouncedSearchTerm]);

  return (
    <div className="search-books">
      <div className="search-books-bar">
        <Link to="/" className="close-search">
          close
        </Link>

        <div className="search-books-input-wrapper">
          <input
            type="text"
            placeholder="Search by title or author"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="search-books-results">
        {searchResult.length > 0 ? (
          <ol className="books-grid">
            {searchResult.map((book) => (
              <Book
                key={book.id}
                book={book}
                changeShelf={changeShelf}
                shelf={book.shelf}
              />
            ))}
          </ol>
        ) : searchError && searchTerm !== "" ? (
          <p>Sorry!, no results found 😢</p>
        ) : (
          <p>Search Result Will Be Shown Here</p>
        )}
      </div>
    </div>
  );
}

export default Search;