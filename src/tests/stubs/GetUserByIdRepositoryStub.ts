import { user } from "../fixtures/user";

export class GetUserByIdRepositoryStub {
  async execute(id: string): Promise<any> {
    return {
      ...user,
      id
    };
  }
}
