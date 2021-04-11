import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../modules/users/useCases/createUser/ICreateUserDTO";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('Should be able to get user balance', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    const { id: user_id } = await createUserUseCase.execute({ ...user });

    const result = await getBalanceUseCase.execute({ user_id });

    expect(result.balance).toBe(0);
  });

  it('Should not be able to get user balance if user does not exist', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'Inexistent' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
