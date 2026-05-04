import { jest } from '@jest/globals';
import { AppError } from '../errors/app.error';
import type { User } from '../db/schema';
import type { generateAccessToken } from '../helpers/token.helper';

import type * as userServiceObj from './user.service';
import type * as refreshTokenServiceObj from './refresh-token.service';
import type * as authServiceObj from './auth.service';
import type * as userHelpersObj from '../helpers/user.helpers';

const userServiceMock = {
    getUserByEmail: jest.fn<typeof userServiceObj.getUserByEmail>(),
    getUserById: jest.fn<typeof userServiceObj.getUserById>(),
};

const refreshTokenServiceMock = {
    createRefreshToken: jest.fn<typeof refreshTokenServiceObj.createRefreshToken>(),
    deleteRefreshToken: jest.fn<typeof refreshTokenServiceObj.deleteRefreshToken>(),
    findRefreshToken: jest.fn<typeof refreshTokenServiceObj.findRefreshToken>(),
};

const userHelpersMock = {
    comparePassword: jest.fn<typeof userHelpersObj.comparePassword>(),
    formatUserResponse: jest.fn<typeof userHelpersObj.formatUserResponse>(),
};

const tokenHelpersMock = {
    generateAccessToken: jest.fn<typeof generateAccessToken>(),
};

jest.unstable_mockModule('./user.service', () => userServiceMock);
jest.unstable_mockModule('./refresh-token.service', () => refreshTokenServiceMock);
jest.unstable_mockModule('../helpers/user.helpers', () => userHelpersMock);
jest.unstable_mockModule('../helpers/token.helper', () => tokenHelpersMock);

describe('auth.service', () => {
    let authService: typeof authServiceObj;

    beforeAll(async () => {
        authService = await import('./auth.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('rejects invalid credentials when user does not exist', async () => {
        userServiceMock.getUserByEmail.mockResolvedValue(null);

        await expect(authService.login('user@test.com', 'password')).rejects.toBeInstanceOf(AppError);
        await expect(authService.login('user@test.com', 'password')).rejects.toMatchObject({
            statusCode: 401,
        });
    });

    it('rejects invalid credentials when password does not match', async () => {
        const user: User = {
            id: 'user-id',
            name: 'User',
            email: 'user@test.com',
            password: 'hashed',
            avatar: null,
            isAdmin: false,
            deletedAt: null,
            createdAt: new Date('2024-01-01T00:00:00Z'),
            updatedAt: new Date('2024-01-01T00:00:00Z'),
        };

        userServiceMock.getUserByEmail.mockResolvedValue(user);
        userHelpersMock.comparePassword.mockResolvedValue(false);

        await expect(authService.login('user@test.com', 'password')).rejects.toBeInstanceOf(AppError);
        await expect(authService.login('user@test.com', 'password')).rejects.toMatchObject({
            statusCode: 401,
        });
    });

    it('rejects refresh when token is missing', async () => {
        refreshTokenServiceMock.findRefreshToken.mockResolvedValue(null);

        await expect(authService.refreshTokens('token')).rejects.toBeInstanceOf(AppError);
        await expect(authService.refreshTokens('token')).rejects.toMatchObject({
            statusCode: 401,
        });
    });

    it('deletes expired refresh tokens', async () => {
        refreshTokenServiceMock.findRefreshToken.mockResolvedValue({
            id: 'token-id',
            token: 'token',
            userId: 'user-id',
            expiresAt: new Date('2000-01-01T00:00:00Z'),
            createdAt: new Date('1999-01-01T00:00:00Z'),
        });

        await expect(authService.refreshTokens('token')).rejects.toBeInstanceOf(AppError);
        expect(refreshTokenServiceMock.deleteRefreshToken).toHaveBeenCalledWith('token');
    });
});
