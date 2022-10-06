/* eslint-disable @typescript-eslint/no-extraneous-class */
import { User } from "../entities/User";

export class ProfileMap {
  static toDTO({
    id,
    name,
    email,
    created_at,
    updated_at,
  }: User): Omit<User, "user" | "password" | "statement"> {
    return {
      id,
      name,
      email,
      created_at,
      updated_at,
    };
  }
}
