import { OrderSearchRequest } from '../models/order-search-request';
import { OrderService } from '../services/order-service';
import { OrderSearchRequestArgs } from '../types/order-search-request';
import { Arg, Args, Mutation, Query, Resolver } from 'type-graphql';
import { BookOrder } from '../entities/book-order';
import { OrderInput } from '../types/order-input';
import { OrderFilterType } from '../enums/order-filter-type';


@Resolver(BookOrder)
export class OrderResolver {
  private service = new OrderService();
  
  @Query(returns => [BookOrder])
  async allOrders(@Arg("filterBy", {nullable: true}) filterBy?: OrderFilterType): Promise<BookOrder[]> {
    const {data, error} = await this.service.getOrders(filterBy);
    
    if (error) {
      console.log(error, 'error');
      return [];
    }
    
    return data;
  }
  
  @Query(returns => Boolean)
  async bookExists(
    @Args() { bookId, isbn }: OrderSearchRequestArgs,
  ): Promise<Boolean> {
    const args: OrderSearchRequest = {id: bookId, isbn};
    const {data, error} = await this.service.isBookAvailable(args);
    
    // error getting information logged in service
    if (error) return false;
    
    return data;
  }
  
  @Mutation(returns => BookOrder)
  async reserveBook(@Arg("bookId") bookId: number): Promise<BookOrder> {
    const { data, error } = await this.service.reserve(bookId);
    
    // additional error handling here
    if (error) {
      return null;
    }
    
    return data;
  }
  
  @Mutation(returns => BookOrder) 
  async purchaseBook(@Arg("order") orderInput: OrderInput): Promise<BookOrder> {
    const { data, error } = await this.service.purchase(orderInput.bookId);
    
    // additional error handling here
    if (error) return null;
    
    return data;
  }
  
}