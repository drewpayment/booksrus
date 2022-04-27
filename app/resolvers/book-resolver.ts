import { BookInput } from '../types/book-input';
import { Arg, Mutation, Query, Resolver } from 'type-graphql';
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

  @Query((returns) => [Book])
  async search(@Arg('searchText') searchText: string): Promise<Book[]> {
    searchText = searchText.replace(' ', '').toLowerCase();
    const { data, error } = await this.service.getAllBooks();

    if (error) {
      console.log(error, 'error');
      return [];
    }

    const searchResults = data.filter(
      (x) =>
        x.title.toLowerCase().includes(searchText) ||
        x.category.toLowerCase().includes(searchText) ||
        x.author.toLowerCase().includes(searchText) ||
        x.isbn.toLowerCase().includes(searchText),
    );

    return searchResults;
  }

  @Mutation((returns) => Book)
  async addBook(@Arg('book') book: BookInput): Promise<Book> {
    const { data, error } = await this.service.addBook(book);

    if (error) {
      console.log(error, 'error');
      return null;
    }

    return data;
  }
  
  @Mutation(returns => Book)
  async updateBook(@Arg('book') book: BookInput): Promise<Book> {
    const { data, error } = await this.service.updateBook(book);
    
    if (error) {
      console.log(error, 'error');
      return null;
    }
    
    return data;
  }
}
