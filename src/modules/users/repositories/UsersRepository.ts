import { getRepository, Repository } from "typeorm";

import { User } from "../entities/User";
import { ICreateUserDTO } from "../useCases/createUser/ICreateUserDTO";
import { IUsersRepository } from "./IUsersRepository";

export class UsersRepository implements IUsersRepository {
  private readonly repository: Repository<User>;

  constructor() {
    this.repository = getRepository(User);
  }

  async findByEmail(email: string): Promise<User | undefined> {
    return await this.repository.findOne({
      email,
    });
  }

  async findById(user_id: string): Promise<User | undefined> {
    return await this.repository.findOne(user_id);
  }

  async create({ name, email, password }: ICreateUserDTO): Promise<User> {
    const user = this.repository.create({ name, email, password });

    return await this.repository.save(user);
  }
}
