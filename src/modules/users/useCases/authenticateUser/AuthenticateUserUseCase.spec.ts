import { InMemoryUsersRepository } from "../../repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../createUser/ICreateUserDTO";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";

let inMemoryUsersRepository: InMemoryUsersRepository;
let createUserUseCase: CreateUserUseCase;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('Authenticate user', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    authenticateUserUseCase = new AuthenticateUserUseCase(inMemoryUsersRepository);
  });

  it('Should be able to authenticate an user', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    await createUserUseCase.execute({ ...user });

    const result = await authenticateUserUseCase.execute({
      email: user.email,
      password: user.password
    });

    expect(result).toHaveProperty('token');
  });

  it('Should not be able to authenticate a user if it does not exist', async () => {
    expect(async () => {
      await authenticateUserUseCase.execute({
        email: 'inexistent@test.com',
        password: '123456',
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it('Should not be able to authenticate a user if its password does not match', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Test',
        email: 'user@test.com',
        password: '123456',
      };

      await createUserUseCase.execute({ ...user });

      await authenticateUserUseCase.execute({
        email: user.email,
        password: 'Incorrect'
      });
    }).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
