import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { User } from '../user/entities/user.entity';
import { CreateUserDto } from '../user/dto/create-user.dto';

jest.mock('bcrypt', () => ({
  compare: jest.fn(),
  hash: jest.fn(),
}));

describe('AuthService', () => {
  let service: AuthService;

  const mockJwtService = {
    signAsync: jest.fn().mockResolvedValue('mocked_access_token'),
  };

  const mockJwtRefreshService = {
    signAsync: jest.fn().mockResolvedValue('mocked_refresh_token'),
  };

  const mockUserService = {
    findOneByEmail: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    updateRefreshToken: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
        {
          provide: 'JWT_REFRESH_SERVICE',
          useValue: mockJwtRefreshService,
        },
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return User, when password is correct', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'hashedPassword',
      };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const result = await service.validateUser(
        'test@example.com',
        'password123',
      );

      expect(result).toEqual(mockUser);
      expect(mockUserService.findOneByEmail).toHaveBeenCalledWith(
        'test@example.com',
      );
    });

    it('should throw UnauthorizedException, when password is incorrect', async () => {
      const mockUser = {
        email: 'test@example.com',
        password: 'wrongHashedPassword',
      };
      mockUserService.findOneByEmail.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.validateUser('test@example.com', 'wrongHashedPassword'),
      ).rejects.toThrow(UnauthorizedException);
    });

    it('should throw UnauthorizedException, when User does not exist', async () => {
      mockUserService.findOneByEmail.mockResolvedValue(null);

      await expect(
        service.validateUser('wrong@example.com', 'password123'),
      ).rejects.toThrow(UnauthorizedException);
    });
  });

  describe('getTokens', () => {
    it('should return accessToken and refreshToken for provided User', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
      } as User;

      const expectedPayload = {
        email: mockUser.email,
        id: mockUser.id,
      };

      mockJwtService.signAsync.mockResolvedValue('mocked_access_token');
      mockJwtRefreshService.signAsync.mockResolvedValue('mocked_refresh_token');

      const result = await service.getTokens(mockUser);

      expect(result).toEqual({
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      });

      expect(mockJwtService.signAsync).toHaveBeenCalledWith(expectedPayload);
      expect(mockJwtRefreshService.signAsync).toHaveBeenCalledWith(
        expectedPayload,
      );
    });
  });

  describe('login', () => {
    it('should login provided User, save refreshToken and return accessToken and refreshToken', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
      } as User;

      const mockTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      const getTokensSpy = jest
        .spyOn(service, 'getTokens')
        .mockResolvedValue(mockTokens);

      const updateRefreshTokenSpy = jest
        .spyOn(service, 'updateRefreshToken')
        .mockResolvedValue(undefined);

      const result = await service.login(mockUser);

      expect(result).toEqual(mockTokens);
      expect(getTokensSpy).toHaveBeenCalledWith(mockUser);
      expect(updateRefreshTokenSpy).toHaveBeenCalledWith(
        mockUser.id,
        mockTokens.refreshToken,
      );
    });
  });

  describe('updateRefreshToken', () => {
    it('should hash refreshToken and save it via userService', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      const mockRefreshToken = 'mocked_refresh_token';
      const mockHashedToken = 'hashed_refresh_token_value';

      (bcrypt.hash as jest.Mock).mockResolvedValue(mockHashedToken);
      mockUserService.updateRefreshToken.mockResolvedValue(undefined);

      await service.updateRefreshToken(mockUserId, mockRefreshToken);

      expect(bcrypt.hash).toHaveBeenCalledWith(mockRefreshToken, 10);

      expect(mockUserService.updateRefreshToken).toHaveBeenCalledWith(
        mockUserId,
        mockHashedToken,
      );
    });
  });

  describe('refreshToken', () => {
    it('should return new accessToken and refreshToken, when provided refreshToken is correct for User with userId', async () => {
      const mockOldRefreshToken = 'mocked_old_refresh_token';

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        currentHashedRefreshToken: 'hashed_old_refresh_token',
      } as User;

      const mockNewTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      mockUserService.findOne.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(true);

      const getTokensSpy = jest
        .spyOn(service, 'getTokens')
        .mockResolvedValue(mockNewTokens);

      const updateRefreshTokenSpy = jest
        .spyOn(service, 'updateRefreshToken')
        .mockResolvedValue(undefined);

      const result = await service.refreshTokens(
        mockUser.id,
        mockOldRefreshToken,
      );

      expect(result).toEqual(mockNewTokens);
      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockOldRefreshToken,
        mockUser.currentHashedRefreshToken,
      );
      expect(getTokensSpy).toHaveBeenCalledWith(mockUser);
      expect(updateRefreshTokenSpy).toHaveBeenCalledWith(
        mockUser.id,
        mockNewTokens.refreshToken,
      );
    });

    it('should throw UnauthorizedException, when User with provided userId does not exist', async () => {
      const mockOldRefreshToken = 'mocked_old_refresh_token';

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
      } as User;

      mockUserService.findOne.mockResolvedValue(null);

      await expect(
        service.refreshTokens(mockUser.id, mockOldRefreshToken),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException, when User with provided userId does not have currentHashedRefreshToken', async () => {
      const mockOldRefreshToken = 'mocked_old_refresh_token';

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
      } as User;

      mockUserService.findOne.mockResolvedValue(mockUser);

      await expect(
        service.refreshTokens(mockUser.id, mockOldRefreshToken),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.id);
    });

    it('should throw UnauthorizedException, when refreshTokens does not match', async () => {
      const mockOldRefreshToken = 'mocked_old_refresh_token';

      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: 'test@example.com',
        currentHashedRefreshToken: 'hashed_old_refresh_token',
      } as User;

      mockUserService.findOne.mockResolvedValue(mockUser);

      (bcrypt.compare as jest.Mock).mockResolvedValue(false);

      await expect(
        service.refreshTokens(mockUser.id, mockOldRefreshToken),
      ).rejects.toThrow(UnauthorizedException);

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUser.id);
      expect(bcrypt.compare).toHaveBeenCalledWith(
        mockOldRefreshToken,
        mockUser.currentHashedRefreshToken,
      );
    });
  });

  describe('register', () => {
    it('should create a new user via userService and automatically login them', async () => {
      const createUserDto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
        bio: 'Hello world',
      };

      const mockCreatedUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createUserDto,
      } as any;

      const mockTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      mockUserService.create.mockResolvedValue(mockCreatedUser);

      const loginSpy = jest
        .spyOn(service, 'login')
        .mockResolvedValue(mockTokens);

      const result = await service.register(createUserDto);

      expect(result).toEqual(mockTokens);
      expect(mockUserService.create).toHaveBeenCalledWith(createUserDto);
      expect(loginSpy).toHaveBeenCalledWith(mockCreatedUser);
    });
  });
});
