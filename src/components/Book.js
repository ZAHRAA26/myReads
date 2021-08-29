import React from "react";
import PropTypes from "prop-types";
import noCover from "../images/noCover.jpg";

const Book = (props) => {
  const { book, changeShelf } = props;
  Book.propTypes = {
    book: PropTypes.object.isRequired,
    changeShelf: PropTypes.func.isRequired,
  };
  const eventHandler = (event) => {
    const sectionValue = event.target.value;
    changeShelf(book, sectionValue);
  };
  return (
    <li>
      <div className="book">
        <div className="book-top">
          <div
            className="book-cover"
            style={{
              width: 128,
              height: 193,
              backgroundImage: `url("${
                book.imageLinks && book.imageLinks.smallThumbnail
                  ? book.imageLinks.smallThumbnail
                  : noCover
              }")`,
            }}
          />
          <div className="book-shelf-changer">
            {/* onChange={(Event) => onChangeSection(Event)} */}
            <select
              id="selectShelf"
              onChange={(Event) => eventHandler(Event)}
              defaultValue={book.shelf}
            >
              <option value="move" disabled>
                Move to...
              </option>
              <option value="none">None</option>
              <option value="currentlyReading">Currently Reading</option>
              <option value="read">Read</option>
              <option value="wantToRead">Want to Read</option>
            </select>
          </div>
        </div>
        <div className="book-title">{book.title}</div>
        <div className="book-authors">
          {book.authors ? (
            book.authors && book.authors.join(", ")
          ) : (
            <p>No authors mensioned</p>
          )}
        </div>
      </div>
    </li>
  );
};

export default Book;
