import { OperationType } from "../../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getBalanceUseCase: GetBalanceUseCase;

describe('Get balance', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getBalanceUseCase = new GetBalanceUseCase(inMemoryStatementsRepository, inMemoryUsersRepository);
  });

  it('Should be able to get user balance', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    const { id: user_id } = await createUserUseCase.execute(user);

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: 'Deposit',
    });

    await createStatementUseCase.execute({
      user_id,
      type: OperationType.WITHDRAW,
      amount: 100,
      description: 'Withdraw',
    });

    const result = await getBalanceUseCase.execute({ user_id });

    expect(result.balance).toBe(100);
    expect(result.statement.length).toBe(2);
  });

  it('Should not be able to get user balance if user does not exist', async () => {
    expect(async () => {
      await getBalanceUseCase.execute({ user_id: 'Inexistent' });
    }).rejects.toBeInstanceOf(GetBalanceError);
  });
});
