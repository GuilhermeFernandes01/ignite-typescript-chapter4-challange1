import { OperationType } from "../../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;

describe('Create statement', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('Should be able to create a new statement', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    const { id } = await createUserUseCase.execute({ ...user });

    const result = await createStatementUseCase.execute({
      user_id: id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: 'Deposit',
    });

    expect(result).toHaveProperty('id');
  });

  it('Should not be able to create a statement if user does not exist', async () => {
    expect(async () => {
      await createStatementUseCase.execute({
        user_id: 'Inexistent',
        type: OperationType.DEPOSIT,
        amount: 200,
        description: 'Fail',
      });
    }).rejects.toBeInstanceOf(CreateStatementError.UserNotFound);
  });

  it('Should not be able to create a statement if user does not have enough funds', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Test',
        email: 'user@test.com',
        password: '123456',
      };

      const { id } = await createUserUseCase.execute({ ...user });

      await createStatementUseCase.execute({
        user_id: id,
        type: OperationType.WITHDRAW,
        amount: 100,
        description: 'Fail',
      });
    }).rejects.toBeInstanceOf(CreateStatementError.InsufficientFunds);
  });
});
