import { UserRepository } from '../../domain/repositories/user.repository';
export class DeleteUserUseCase {
  constructor(private readonly userReopository: UserRepository) {}

  async execute(id: string): Promise<void> {
    await this.userReopository.deleteUser(id);
  }
}
