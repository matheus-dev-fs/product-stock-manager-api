import { formatUserResponse } from './user.helpers';
import type { User } from '../db/schema';

describe('user.helpers', () => {
  const originalBaseUrl = process.env.BASE_URL;

  afterEach(() => {
    process.env.BASE_URL = originalBaseUrl;
  });

  it('formats the user response and appends avatar url', () => {
    process.env.BASE_URL = 'http://localhost:3000';

    const user: User = {
      id: 'user-id',
      name: 'Jane Doe',
      email: 'jane@test.com',
      password: 'hashed-password',
      avatar: 'avatar.png',
      isAdmin: false,
      deletedAt: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    };

    const result = formatUserResponse(user);

    expect(result).toEqual({
      id: 'user-id',
      name: 'Jane Doe',
      email: 'jane@test.com',
      avatar: 'http://localhost:3000/public/avatars/avatar.png',
      isAdmin: false,
    });
  });

  it('keeps avatar undefined when missing', () => {
    const user: User = {
      id: 'user-id',
      name: 'Jane Doe',
      email: 'jane@test.com',
      password: 'hashed-password',
      avatar: null,
      isAdmin: false,
      deletedAt: null,
      createdAt: new Date('2024-01-01T00:00:00Z'),
      updatedAt: new Date('2024-01-02T00:00:00Z'),
    };

    const result = formatUserResponse(user);

    expect(result).toEqual({
      id: 'user-id',
      name: 'Jane Doe',
      email: 'jane@test.com',
      avatar: null,
      isAdmin: false,
    });
  });
});
