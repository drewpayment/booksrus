import { HttpError } from '../models/http-error';
import { Book } from '../entities/book';
import { BookOrder } from '../entities/book-order';
import { OpResult } from '../models/opresult';
import { OrderSearchRequest } from '../models/order-search-request';
import { BookService } from './book-service';
import { OrderFilterType } from '../enums/order-filter-type';

const errors = {
  outOfStock: {
    name: 'OutOfInventoryException',
    message: 'The specified book is out of stock. Please try again later.',
    status: 400,
  } as HttpError,
};

//#region

function seed(): BookOrder[] {
  return [];
}

const DATABASE = seed();

//#endregion

export class OrderService {
  private items = DATABASE;
  private bookService = new BookService();
  get nextId(): number {
    if (!this.items.length) return 1;
    return Math.max(...this.items.map((x) => x.id)) + 1;
  }
  
  async getOrders(filterBy: OrderFilterType = OrderFilterType.none): Promise<OpResult<BookOrder[]>> {
    return new Promise((resolve, reject) => {
      try {
        let result: BookOrder[];
      
        if (filterBy === OrderFilterType.reservations) {
          result = this.items.filter(x => x.isReservation);  
        } else if (filterBy === OrderFilterType.purchases) {
          result = this.items.filter(x => !x.isReservation);
        } else {
          result = [...this.items];
        }
        
        resolve({data: result});
      } catch (error) {
        
        reject({data: null, error});
      }
    });
  }

  async isBookAvailable(
    params: OrderSearchRequest,
  ): Promise<OpResult<boolean>> {
    return new Promise(async (resolve, reject) => {
      if (params.id) {
        const { data, error } = await this.bookService.getBookById(params.id);

        if (error) {
          reject({ data: null, error });
          return;
        }

        if (data) {
          resolve({ data: true });
          return;
        }
      } else if (params.isbn) {
        const { data: allBooks, error } = await this.bookService.getAllBooks();

        if (error) {
          reject({ data: null, error });
          return;
        }

        const isFound = allBooks.find((x) => x.isbn === params.isbn);
        resolve({ data: !!isFound });
      }

      resolve({ data: false });
    });
  }

  async reserve(bookId: number): Promise<OpResult<BookOrder>> {
    return new Promise(async (resolve, reject) => {
      try {
        const { data: book, error: bookError } =
          await this.bookService.getBookById(bookId);

        // internal error in the book service
        if (bookError) {
          return reject({ data: null, error: bookError });
        }

        // handle if we don't have inventory to support the reservation
        if (book.inventory < 1) {
          return reject({
            data: null,
            error: errors.outOfStock,
          });
        }

        const reserve = {...new BookOrder(),
          id: this.nextId,
          book: {...book},
          isReservation: true,
        } as BookOrder;

        this.items.push(reserve);

        // if success ... remove inventory from book db
        const updatedBook = { ...book, inventory: book.inventory - 1 } as Book;
        try {
          const { data: bookUpdated, error: updateBookErr } =
            await this.bookService.updateBook(updatedBook);

          if (updateBookErr)
            return reject({ data: null, error: updateBookErr });
        } catch (updateBookError) {
          return reject({ data: null, error: updateBookError });
        }

        resolve({ data: reserve });
      } catch (error) {
        reject({ data: null, error });
      }
    });
  }

  async purchase(bookId: number): Promise<OpResult<BookOrder>> {
    return new Promise(async (resolve, reject) => {
      let result: BookOrder;
      const { data: book, error: bookErr } = await this.bookService.getBookById(
        bookId,
      );

      if (book.inventory < 1)
        return reject({
          data: null,
          error: errors.outOfStock,
        });

      if (bookErr) return reject({ data: null, error: bookErr });

      // check for reserved order, in real implementation we would have user information
      // to tie reservations to particular users and make sure that we were only getting a
      // reservation for our particular user
      const resIdx = this.items.findIndex((x) => x.book.id === bookId);
      if (resIdx > -1) {
        const order = this.items.find((x) => x.book.id === bookId);

        const updatedOrder = { ...order, isReservation: false } as BookOrder;

        this.items[resIdx] = updatedOrder;
        result = updatedOrder;
      } else {
        const newOrder: BookOrder = {...new BookOrder(),
          id: this.nextId,
          book: { id: bookId } as Book,
          isReservation: false,
        };

        this.items.push(newOrder);
        result = newOrder;
        
        // decrease book inventory for the newly purchased book
        const updatedBook = { ...book, inventory: book.inventory - 1 } as Book;
        const { data: updated, error: updateErr } =
          await this.bookService.updateBook(updatedBook);
          
        if (updateErr) return reject({data: null, error: updateErr});
      }

      resolve({ data: result });
    });
  }
}
