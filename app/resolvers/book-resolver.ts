import { Arg, Query, Resolver } from 'type-graphql';
import { Book } from '../entities/book';
import { BookService } from '../services/book-service';

@Resolver(Book)
export class BookResolver {
  private service = new BookService();

  @Query((returns) => Book, { nullable: true })
  async book(@Arg('id') id: number): Promise<Book | null> {
    const { data, error } = await this.service.getBookById(id);

    if (error) {
      // more robust error handling?
      return null;
    }

    return data;
  }

  @Query((returns) => [Book], { nullable: true })
  async books(@Arg('title') title: string): Promise<Book[] | null> {
    const { data, error } = await this.service.getBooksByTitle(title);

    if (error) {
      // more robust error handling?
      return null;
    }

    return data;
  }

  @Query((returns) => [Book], {
    description: 'Get all the books in the collection.',
  })
  async allBooks(): Promise<Book[]> {
    return (await this.service.getAllBooks()).data;
  }
}
