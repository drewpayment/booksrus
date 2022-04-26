import { Field, Int, ObjectType } from 'type-graphql';
import { Book } from './book';

@ObjectType()
export class BookOrder {
  @Field(type => Int)
  id: number;
  
  @Field(type => Boolean, { defaultValue: false })
  isReservation: boolean;
  
  @Field(type => Book)
  book: Book;
}