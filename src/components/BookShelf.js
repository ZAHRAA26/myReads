import React from "react";
import PropTypes from "prop-types";
import Book from "./Book";

const BookShelf = (props) => {
  const { shelfName, changeShelf, books } = props;
  BookShelf.propTypes = {
    books: PropTypes.array.isRequired,
    changeShelf: PropTypes.func.isRequired,
    shelfName: PropTypes.string.isRequired,
  };

  return (
    <div className="bookshelf">
      <h2 className="bookshelf-title">{shelfName}</h2>
      <div className="bookshelf-books">
        <ol className="books-grid">
          {books.map((book) => (
            <Book key={book.id} book={book} changeShelf={changeShelf} />
          ))}
        </ol>
      </div>
    </div>
  );
};

export default BookShelf;
