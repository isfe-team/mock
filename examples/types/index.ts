import IResponseResult from "./Response";
import { User } from "./User";

export type UserResponse = IResponseResult<User>
export type UsersResponse = IResponseResult<Array<User>>
export type ErrorResponse = IResponseResult<null>
export type HelloWorldResponse = IResponseResult<'Hello'>
