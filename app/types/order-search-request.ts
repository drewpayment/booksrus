import { ArgsType, Field, Float, Int } from 'type-graphql';


@ArgsType()
export class OrderSearchRequestArgs {
  @Field(type => Float!, { nullable: true })
  bookId?: number;
  
  @Field({ nullable: true })
  isbn?: string;
}