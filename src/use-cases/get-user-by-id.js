export class GetUserByIdUseCase {
  constructor(getUserByIdRepository) {
    this.getUserByIdRepository = getUserByIdRepository;
  }
  async getUserById(id) {
    const userReturned = await this.getUserByIdRepository.getUserById(id);

    return userReturned;
  }
}
