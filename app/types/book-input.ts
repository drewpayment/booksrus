import { Field, InputType } from 'type-graphql';


@InputType()
export class BookInput {
  @Field({ nullable: true })
  id?: number;
  
  @Field({ nullable: true })
  title?: string;
  
  @Field({ nullable: true })
  author?: string;
  
  @Field({ nullable: true })
  isbn?: string;
  
  @Field({ nullable: true })
  category?: string;
  
  @Field({ nullable: true })
  inventory?: number;
  
  @Field({ nullable: true })
  releaseDate?: Date;
  
  @Field({ nullable: true })
  retailPrice?: number;
  
  @Field({ nullable: true })
  salePrice?: number;
  
  @Field({ nullable: true })
  notes?: string;
}