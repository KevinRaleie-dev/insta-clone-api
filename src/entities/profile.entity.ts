import { Field, ObjectType } from "type-graphql";

@ObjectType()
export class Profile {
  @Field({ nullable: true })
  id?: string;

  @Field({ nullable: true })
  bio?: string;

  @Field({ nullable: true })
  userId?: string;
}
