import { Test, TestingModule } from '@nestjs/testing';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { CreateUserDto } from '../user/dto/create-user.dto';
import { LoginDto } from './dto/login.dto';

describe('AuthController', () => {
  let controller: AuthController;

  const mockAuthService = {
    validateUser: jest.fn(),
    getTokens: jest.fn(),
    login: jest.fn(),
    updateRefreshToken: jest.fn(),
    refreshTokens: jest.fn(),
    register: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [AuthController],
      providers: [
        {
          provide: AuthService,
          useValue: mockAuthService,
        },
      ],
    }).compile();

    controller = module.get<AuthController>(AuthController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('login', () => {
    it('should pass LoginDto to AuthService.validateUser and return login user', async () => {
      const dto: LoginDto = {
        email: 'test@example.com',
        password: 'password123',
      };
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...dto,
      } as any;

      const mockTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      mockAuthService.validateUser.mockResolvedValue(mockUser);
      mockAuthService.login.mockResolvedValue(mockTokens);

      const result = await controller.login(dto);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.validateUser).toHaveBeenCalledWith(
        dto.email,
        dto.password,
      );
      expect(mockAuthService.login).toHaveBeenCalledWith(mockUser);
    });
  });

  describe('register', () => {
    it('should pass CreateUserDto do AuthService.register and return results', async () => {
      const dto: CreateUserDto = {
        username: 'testuser',
        email: 'test@example.com',
        password: 'password123',
      };
      const mockTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      mockAuthService.register.mockResolvedValue(mockTokens);

      const result = await controller.register(dto);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.register).toHaveBeenCalledWith(dto);
    });
  });

  describe('refreshTokens', () => {
    it('should pass refreshTokens and currents userId to AuthService.refreshTokens and return new tokes', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      const mockOldRefreshToken = 'mocked_old_refresh_token';

      const mockReq = {
        user: {
          userId: mockUserId,
          refreshToken: mockOldRefreshToken,
        },
      };

      const mockTokens = {
        accessToken: 'mocked_access_token',
        refreshToken: 'mocked_refresh_token',
      };

      mockAuthService.refreshTokens.mockResolvedValue(mockTokens);

      const result = await controller.refreshTokens(mockReq);

      expect(result).toEqual(mockTokens);
      expect(mockAuthService.refreshTokens).toHaveBeenCalledWith(
        mockUserId,
        mockOldRefreshToken,
      );
    });
  });
});
