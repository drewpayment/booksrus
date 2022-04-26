import { Book } from '../entities/book';
import { FieldResolver, Query, Resolver } from 'type-graphql';
import { BookService } from '../services/book-service';
import { isBefore } from 'date-fns';

@Resolver(Book)
export class WishlistResolver {
  private service = new BookService();

  @Query(returns => [Book])
  async inStock(): Promise<Book[]> {
    const { data, error } = await this.service.getAllBooks();

    if (error) {
      console.log(error, 'error');
      return [];
    }

    return data.filter((x) => x.inventory > 0);
  }

  @Query(returns => [Book])
  async outOfStock(): Promise<Book[]> {
    const { data, error } = await this.service.getAllBooks();

    if (error) {
      console.log(error, 'error');
      return [];
    }

    return data.filter((x) => x.inventory < 1);
  }

  @Query(returns => [Book])
  async prereleaseBooks(): Promise<Book[]> {
    const { data, error } = await this.service.getAllBooks();

    if (error) {
      console.log(error, 'error');
      return [];
    }

    const today = Date.now();
    return data.filter((x) => isBefore(today, x.releaseDate));
  }

  @Query(returns => [Book])
  async saleBooks(): Promise<Book[]> {
    const { data, error } = await this.service.getAllBooks();

    if (error) {
      console.log(error, 'error');
      return [];
    }

    return data.filter((x) => x.salePrice < x.retailPrice);
  }
}
