import { jest } from '@jest/globals';
import { AppError } from '../errors/app.error';
import type { User, NewUser } from '../db/schema';
import type { hashPassword } from '../helpers/user.helpers';

import type * as userRepositoryObj from '../repositories/user.repository';
import type * as fileServiceObj from './file.service';
import type * as userServiceObj from './user.service';
import type * as userHelpersObj from '../helpers/user.helpers';
import { PublicUser } from '../types/users/public-user.type';

const userRepositoryMock = {
    isEmailInUse: jest.fn<typeof userRepositoryObj.isEmailInUse>(),
    createUser: jest.fn<typeof userRepositoryObj.createUser>(),
    getUserByEmail: jest.fn<typeof userRepositoryObj.getUserByEmail>(),
    getUserById: jest.fn<typeof userRepositoryObj.getUserById>(),
    listUsers: jest.fn<typeof userRepositoryObj.listUsers>(),
    deleteUserById: jest.fn<typeof userRepositoryObj.deleteUserById>(),
    updateUserById: jest.fn<typeof userRepositoryObj.updateUserById>(),
};

const fileServiceMock = {
    deleteAvatar: jest.fn<typeof fileServiceObj.deleteAvatar>(),
};

const userHelpersMock = {
    hashPassword: jest.fn<typeof userHelpersObj.hashPassword>(),
    
    // Podemos tipar e já passar a implementação logo em seguida usando o .mockImplementation()
    formatUserResponse: jest.fn<typeof userHelpersObj.formatUserResponse>().mockImplementation(
        (user: User): PublicUser => ({ 
            id: user.id, 
            email: user.email, 
            name: user.name, 
            isAdmin: user.isAdmin, 
            avatar: user.avatar 
        })
    ),
    
    comparePassword: jest.fn<typeof userHelpersObj.comparePassword>(),
};

jest.unstable_mockModule('../repositories/user.repository', () => userRepositoryMock);
jest.unstable_mockModule('./file.service', () => fileServiceMock);
jest.unstable_mockModule('../helpers/user.helpers', () => userHelpersMock);

describe('user.service', () => {
    let userService: typeof userServiceObj;

    beforeAll(async () => {
        userService = await import('./user.service');
    });

    beforeEach(() => {
        jest.clearAllMocks();
    });

    describe('createUser', () => {
        it('throws error when email is already in use', async () => {
            userRepositoryMock.isEmailInUse.mockResolvedValue(true);

            const newUserData: NewUser = { name: 'Test', email: 'test@test.com', password: '123' };

            await expect(userService.createUser(newUserData)).rejects.toBeInstanceOf(AppError);
            await expect(userService.createUser(newUserData)).rejects.toMatchObject({ statusCode: 400 });
            expect(userRepositoryMock.createUser).not.toHaveBeenCalled();
        });

        it('creates user successfully and formats response', async () => {
            userRepositoryMock.isEmailInUse.mockResolvedValue(false);
            userHelpersMock.hashPassword.mockResolvedValue('hashed-password');

            const mockCreatedUser = { id: 'uuid', name: 'Test', email: 'test@test.com', password: 'hashed-password', isAdmin: false, avatar: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
            userRepositoryMock.createUser.mockResolvedValue(mockCreatedUser);

            const result = await userService.createUser({ name: 'Test', email: 'test@test.com', password: '123' });

            expect(userRepositoryMock.createUser).toHaveBeenCalledWith({ name: 'Test', email: 'test@test.com', password: 'hashed-password' });
            expect(result).toEqual({ id: 'uuid', email: 'test@test.com', name: 'Test', isAdmin: false, avatar: null });
        });
    });

    describe('updateUserById', () => {
        it('returns null if user to update is not found', async () => {
            userRepositoryMock.getUserById.mockResolvedValue(null);
            const result = await userService.updateUserById('uuid', { name: 'New Name' });
            expect(result).toBeNull();
        });

        it('throws error if updating to an email that is already in use', async () => {
            const mockExistingUser = { id: 'uuid', name: 'Test', email: 'old@test.com', password: 'hashed-password', isAdmin: false, avatar: null, createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
            userRepositoryMock.getUserById.mockResolvedValue(mockExistingUser);
            userRepositoryMock.isEmailInUse.mockResolvedValue(true);

            await expect(userService.updateUserById('uuid', { email: 'new@test.com' })).rejects.toBeInstanceOf(AppError);
            await expect(userService.updateUserById('uuid', { email: 'new@test.com' })).rejects.toMatchObject({ statusCode: 400 });
        });

        it('updates user successfully', async () => {
            const mockExistingUser = { id: 'uuid', name: 'Old Name', email: 'test@test.com', password: 'pwd', isAdmin: false, avatar: 'old-avatar.png', createdAt: new Date(), updatedAt: new Date(), deletedAt: null };
            const mockUpdatedUser = { ...mockExistingUser, name: 'New Name', avatar: 'new-avatar.png' };

            userRepositoryMock.getUserById.mockResolvedValue(mockExistingUser);
            userRepositoryMock.updateUserById.mockResolvedValue(mockUpdatedUser);
            fileServiceMock.deleteAvatar.mockResolvedValue();

            const result = await userService.updateUserById('uuid', { name: 'New Name', avatar: 'new-avatar.png' });

            expect(fileServiceMock.deleteAvatar).toHaveBeenCalledWith('old-avatar.png');
            expect(userRepositoryMock.updateUserById).toHaveBeenCalled();
            expect(result).toEqual({ id: 'uuid', email: 'test@test.com', name: 'New Name', isAdmin: false, avatar: 'new-avatar.png' });
        });
    });
});
