import { OperationType, Statement } from "../../../../modules/statements/entities/Statement";
import { InMemoryStatementsRepository } from "../../../../modules/statements/repositories/in-memory/InMemoryStatementsRepository";
import { InMemoryUsersRepository } from "../../../../modules/users/repositories/in-memory/InMemoryUsersRepository";
import { CreateUserUseCase } from "../../../../modules/users/useCases/createUser/CreateUserUseCase";
import { ICreateUserDTO } from "../../../../modules/users/useCases/createUser/ICreateUserDTO";
import { CreateStatementUseCase } from "../createStatement/CreateStatementUseCase";
import { GetStatementOperationError } from "./GetStatementOperationError";
import { GetStatementOperationUseCase } from "./GetStatementOperationUseCase";

let inMemoryUsersRepository: InMemoryUsersRepository;
let inMemoryStatementsRepository: InMemoryStatementsRepository;
let createUserUseCase: CreateUserUseCase;
let createStatementUseCase: CreateStatementUseCase;
let getStatementOperationUseCase: GetStatementOperationUseCase;

describe('Get statement operation', () => {
  beforeEach(() => {
    inMemoryUsersRepository = new InMemoryUsersRepository();
    inMemoryStatementsRepository = new InMemoryStatementsRepository();
    createUserUseCase = new CreateUserUseCase(inMemoryUsersRepository);
    createStatementUseCase = new CreateStatementUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
    getStatementOperationUseCase = new GetStatementOperationUseCase(inMemoryUsersRepository, inMemoryStatementsRepository);
  });

  it('Should be able to get statement operation', async () => {
    const user: ICreateUserDTO = {
      name: 'Test',
      email: 'user@test.com',
      password: '123456',
    };

    const { id: user_id } = await createUserUseCase.execute({ ...user });

    const { id: statement_id } = await createStatementUseCase.execute({
      user_id,
      type: OperationType.DEPOSIT,
      amount: 200,
      description: 'Deposit',
    });

    const result = await getStatementOperationUseCase.execute({ user_id, statement_id });

    expect(result).toBeInstanceOf(Statement);
  });

  it('Should not be able to get statement operation if user does not exist', async () => {
    expect(async () => {
      await getStatementOperationUseCase.execute({ user_id: 'Inexistent', statement_id: 'Any' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.UserNotFound);
  });

  it('Should not be able to get statement operation if statement operation does not exist', async () => {
    expect(async () => {
      const user: ICreateUserDTO = {
        name: 'Test',
        email: 'user@test.com',
        password: '123456',
      };

      const { id: user_id } = await createUserUseCase.execute({ ...user });

      await getStatementOperationUseCase.execute({ user_id, statement_id: 'Inexistent' });
    }).rejects.toBeInstanceOf(GetStatementOperationError.StatementNotFound);
  });
});
