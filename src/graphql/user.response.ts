import { ObjectType } from "type-graphql";
import { MeResponse } from "./me.response";

@ObjectType()
export class UserResponse extends MeResponse {}