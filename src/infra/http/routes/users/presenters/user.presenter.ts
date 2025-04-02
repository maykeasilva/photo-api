import { User } from '@/domain/actors/enterprise/entities/user'

export class UserPresenter {
  static toHTTP(user: User) {
    return {
      id: user.id.toString(),
      name: user.name,
      username: user.username,
      email: user.email,
      avatar_url: user.avatarUrl ?? null,
      created_at: user.createdAt,
      updated_at: user.updatedAt ?? null,
    }
  }
}
