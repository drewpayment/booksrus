import { BookOrder } from '../entities/book-order';
import { Field, InputType } from 'type-graphql';
import { Book } from '../entities/book';


@InputType()
export class OrderInput {
  @Field()
  bookId: number;
  
  @Field({ nullable: true })
  isReservation?: boolean;
}