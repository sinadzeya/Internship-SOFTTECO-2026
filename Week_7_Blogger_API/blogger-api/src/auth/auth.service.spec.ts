import { Test, TestingModule } from '@nestjs/testing';
import { JwtService } from '@nestjs/jwt';
import { AuthService } from './auth.service';
import { UserService } from '../user/user.service';

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
});
