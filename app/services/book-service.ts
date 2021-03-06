import { Book } from '../entities/book';
import { HttpError } from '../models/http-error';
import { OpResult } from '../models/opresult';

//#region DATABASE
function seedDatabase(): Book[] {
  return [
    {
      id: 1,
      title: 'Fundamentals of Wavelets',
      author: 'Goswami, Jaideva',
      isbn: '3726362789',
      category: 'nonfiction',
      inventory: 9,
      releaseDate: new Date(1999, 1, 16),
      retailPrice: 109.99,
      salePrice: 6.97,
      notes: null,
    },
    {
      id: 2,
      title: 'Age of Wrath, The',
      author: 'Eraly, Abraham',
      isbn: '3876253647',
      category: 'nonfiction',
      inventory: 0,
      releaseDate: new Date(2014, 0, 1),
      retailPrice: 42.99,
      salePrice: 16.67,
      notes: 'Backordered until the end of the year',
    },
    {
      id: 3,
      title: 'Slaughterhouse Five',
      author: 'Vonnegut, Kurt',
      isbn: '09283746523',
      category: 'fiction',
      inventory: 3,
      releaseDate: new Date(2015, 10, 3),
      retailPrice: 14.95,
      salePrice: 14.95,
      notes: null,
    },
    {
      id: 4,
      title: 'Moon is Down, The',
      author: 'Steinbeck, John',
      isbn: '37463567283',
      category: 'fiction',
      inventory: 12,
      releaseDate: new Date(2011, 5, 15),
      retailPrice: 13.95,
      salePrice: 12.21,
      notes: null,
    },
    {
      id: 5,
      title: 'Dylan on Dylan',
      author: 'Dylan, Bob',
      isbn: '28710924383',
      category: 'nonfiction',
      inventory: 12,
      releaseDate: new Date(2013, 6, 31),
      retailPrice: 27.97,
      salePrice: 14.95,
      notes: null,
    },
    {
      id: 6,
      title: 'Journal of a Novel',
      author: 'Steinbeck, John',
      isbn: '239847201093',
      category: 'fiction',
      inventory: 8,
      releaseDate: new Date(2022, 10, 16),
      retailPrice: 14.95,
      salePrice: 14.95,
      notes: 'Reorder in November',
    },
  ];
}

// replace with a database layer
const DATABASE = seedDatabase();
//#endregion

export class BookService {
  private items = DATABASE;
  private get nextId(): number {
    if (!this.items.length) return 1;
    return Math.max(...this.items.map((x) => x.id)) + 1;
  }

  async getAllBooks(): Promise<OpResult<Book[]>> {
    return new Promise((resolve, reject) => {
      resolve({ data: this.items });
    });
  }

  /**
   * Get a book by the book's primary key.
   *
   * @param id
   * @returns Promise<Book>
   */
  async getBookById(id: number): Promise<OpResult<Book>> {
    return new Promise((resolve, reject) => {
      try {
        const book = this.items.find((b) => b.id === id);
        resolve({ data: book });
      } catch (error) {
        reject({
          data: null,
          error,
        });
      }
    });
  }

  /**
   * Get a list of books by the title.
   *
   * @param title
   * @returns Promise<Book[]>
   */
  async getBooksByTitle(title: string): Promise<OpResult<Book[]>> {
    return new Promise((resolve, reject) => {
      try {
        const searchText = title.replace(' ', '').toLowerCase();
        const books = this.items.filter((b) =>
          b.title.replace(' ', '').toLowerCase().includes(searchText),
        );
        resolve({ data: books });
      } catch (error) {
        reject({ data: null, error });
      }
    });
  }

  /**
   * Add a new book to the collection.
   *
   * @param book
   * @returns Promise<Book>
   */
  async addBook(book: Partial<Book>): Promise<OpResult<Book>> {
    return new Promise((resolve, reject) => {
      // validation?

      if (book.isbn) {
        const existing = this.items.find((b) => b.isbn === book.isbn);

        if (existing) {
          const error: HttpError = {
            name: 'BadRequest',
            message: 'Book with the same ISBN already exists.',
            status: 400,
          };

          reject({ data: null, error });
          return;
        }
      }

      const dto = {
        ...book,
        id: this.nextId,
      } as Book;

      this.items.push(dto);

      resolve({ data: dto });
    });
  }

  /**
   * Update an existing book.
   *
   * @param book
   * @returns Promise<Book>
   */
  async updateBook(book: Partial<Book>): Promise<OpResult<Book>> {
    return new Promise((resolve, reject) => {
      // validation ?

      const existingIdx = this.items.findIndex((x) => x.id === book.id);

      if (existingIdx < 0) {
        const error: HttpError = {
          name: 'BookNotFound',
          message: 'Unable to find the specified book.',
          status: 400,
        };
        reject({ data: null, error });
        return;
      }

      const updatedItem = { ...this.items[existingIdx], ...book } as Book;
      this.items[existingIdx] = updatedItem;

      resolve({ data: updatedItem });
    });
  }
}
