import { Field, Int, ObjectType } from 'type-graphql';


@ObjectType()
export class Book {
  @Field(type => Int)
  id: number;
  
  @Field()
  title: string;
  
  @Field()
  author: string;
  
  @Field()
  isbn: string;
  
  @Field()
  category: string;
  
  @Field()
  inventory: number;
  
  @Field()
  releaseDate: Date;
  
  @Field()
  retailPrice: number;
  
  @Field()
  salePrice: number;
  
  @Field({ nullable: true })
  notes?: string;  
}
