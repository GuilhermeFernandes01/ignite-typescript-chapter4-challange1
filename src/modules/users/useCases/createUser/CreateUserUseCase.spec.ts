import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserError } from "./CreateUserError";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { ICreateUserDTO } from "./ICreateUserDTO";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;

describe('Create user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
  });

  it('Should be able to create a new user', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    const result = await createUserUseCase.execute({ ...user });

    expect(result).toHaveProperty('id');
  });

  it('Should not be able to create a new user if it already exists', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Test',
        email: 'user@test.com',
        password: '123456',
      };

      await createUserUseCase.execute({ ...user });
      await createUserUseCase.execute({ ...user });
    }).rejects.toBeInstanceOf(CreateUserError);
  });
});
