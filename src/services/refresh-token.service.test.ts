import { jest } from '@jest/globals';
import type { RefreshToken } from '../db/schema/refresh-token';

import type * as tokenHelperObj from '../helpers/token.helper';
import type * as refreshTokenRepositoryObj from '../repositories/refresh-token.repository';
import type * as refreshTokenServiceObj from './refresh-token.service';

const tokenHelperMock = {
    generateRefreshToken: jest.fn<typeof tokenHelperObj.generateRefreshToken>(),
};

const refreshTokenRepositoryMock = {
    createRefreshToken: jest.fn<typeof refreshTokenRepositoryObj.createRefreshToken>(),
    findRefreshToken: jest.fn<typeof refreshTokenRepositoryObj.findRefreshToken>(),
    deleteRefreshToken: jest.fn<typeof refreshTokenRepositoryObj.deleteRefreshToken>(),
};

jest.unstable_mockModule('../helpers/token.helper', () => tokenHelperMock);
jest.unstable_mockModule('../repositories/refresh-token.repository', () => refreshTokenRepositoryMock);

describe('refresh-token.service', () => {
    let refreshTokenService: typeof refreshTokenServiceObj;

    beforeAll(async () => {
        refreshTokenService = await import('./refresh-token.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    it('creates a refresh token successfully', async () => {
        const userId = 'user-123';
        const generatedToken = 'random-token-string';
        const expectedRecord: RefreshToken = {
            id: 'token-uuid',
            userId,
            token: generatedToken,
            expiresAt: new Date(),
            createdAt: new Date()
        };

        tokenHelperMock.generateRefreshToken.mockReturnValue(generatedToken);
        refreshTokenRepositoryMock.createRefreshToken.mockResolvedValue(expectedRecord);

        const result = await refreshTokenService.createRefreshToken(userId);

        expect(tokenHelperMock.generateRefreshToken).toHaveBeenCalled();
        expect(refreshTokenRepositoryMock.createRefreshToken).toHaveBeenCalledWith(userId, generatedToken);
        expect(result).toEqual(expectedRecord);
    });

    it('finds an existing refresh token', async () => {
        const expectedRecord: RefreshToken = {
            id: 'token-uuid',
            userId: 'user-123',
            token: 'random-token-string',
            expiresAt: new Date(),
            createdAt: new Date()
        };

        refreshTokenRepositoryMock.findRefreshToken.mockResolvedValue(expectedRecord);

        const result = await refreshTokenService.findRefreshToken('random-token-string');

        expect(refreshTokenRepositoryMock.findRefreshToken).toHaveBeenCalledWith('random-token-string');
        expect(result).toEqual(expectedRecord);
    });

    it('deletes a refresh token', async () => {
        refreshTokenRepositoryMock.deleteRefreshToken.mockResolvedValue();

        await refreshTokenService.deleteRefreshToken('random-token-string');

        expect(refreshTokenRepositoryMock.deleteRefreshToken).toHaveBeenCalledWith('random-token-string');
    });
});
