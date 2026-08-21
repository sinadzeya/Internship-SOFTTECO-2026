import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import {
  ConflictException,
  ForbiddenException,
  NotFoundException,
} from '@nestjs/common';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserService', () => {
  let service: UserService;

  const mockUserRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserService,
        {
          provide: getRepositoryToken(User),
          useValue: mockUserRepository,
        },
      ],
    }).compile();

    service = module.get<UserService>(UserService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('findOneByEmail', () => {
    const testEmail = 'john.doe@example.com';

    it('should return user when found by email with selected fields', async () => {
      const mockUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: testEmail,
        password: 'hashedPassword123',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOneByEmail(testEmail);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: testEmail },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
      expect(result).toEqual(mockUser);
    });

    it('should return null when user is not found', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      const result = await service.findOneByEmail(testEmail);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: testEmail },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });
      expect(result).toBeNull();
    });
  });

  describe('create', () => {
    it('should create new User, when user with this email does not exist and save it via userRepository.save', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

      const createUserDto: CreateUserDto = {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
        bio: 'Hello, I am a software developer.',
      };

      const mockCreatedEntity = {
        ...createUserDto,
        password: 'hashedPassword123',
      };

      const mockSavedUser = {
        id: mockUserId,
        ...mockCreatedEntity,
      } as any;

      mockUserRepository.findOne.mockResolvedValue(null);

      mockUserRepository.create.mockReturnValue(mockCreatedEntity);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.create(createUserDto);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { email: createUserDto.email },
        select: {
          id: true,
          email: true,
          password: true,
        },
      });

      expect(mockUserRepository.create).toHaveBeenCalledWith(
        expect.objectContaining({
          ...createUserDto,
          password: expect.any(String),
        }),
      );

      expect(mockUserRepository.save).toHaveBeenCalledWith(mockCreatedEntity);
      expect(result).toEqual(mockSavedUser);
    });

    it('should throw ConflictException when user with given email already exists', async () => {
      const createUserDto: CreateUserDto = {
        username: 'johndoe',
        email: 'john.doe@example.com',
        password: 'StrongPassword123!',
        bio: 'Hello, I am a software developer.',
      };

      const existingUser = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        email: createUserDto.email,
        password: 'hashedPassword123',
      } as any;

      mockUserRepository.findOne.mockResolvedValue(existingUser);

      await expect(service.create(createUserDto)).rejects.toThrow(
        new ConflictException('User with provided email already exists'),
      );

      expect(mockUserRepository.create).not.toHaveBeenCalled();
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      const mockUsers = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          email: 'user1@example.com',
          username: 'user1',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          email: 'user2@example.com',
          username: 'user2',
        },
      ] as User[];

      mockUserRepository.find.mockResolvedValue(mockUsers);

      const result = await service.findAll();

      expect(mockUserRepository.find).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a user if found by id', async () => {
      const mockUser = {
        id: mockUserId,
        email: 'john.doe@example.com',
        username: 'johndoe',
      } as User;

      mockUserRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne(mockUserId);

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user does not exist', async () => {
      mockUserRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockUserId)).rejects.toThrow(
        new NotFoundException(`User with id ${mockUserId} does not exist`),
      );

      expect(mockUserRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockUserId },
      });
    });
  });

  describe('update', () => {
    const mockUserId = '123e4567-e89b-12d3-a456-426614174001';
    const mockOtherUserId = '123e4567-e89b-12d3-a456-426614174002';

    it('should update and return user without hashing password if password is not provided', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updatedName',
        bio: 'New bio',
      };

      const mockExistingUser = {
        id: mockUserId,
        username: 'oldName',
        email: 'john@example.com',
        password: 'hashedPassword123',
        bio: 'Old bio',
      } as User;

      const mockSavedUser = {
        ...mockExistingUser,
        ...updateUserDto,
      };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.update(
        mockUserId,
        updateUserDto,
        mockUserId,
      );

      expect(spyFindOne).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          id: mockUserId,
          username: 'updatedName',
          bio: 'New bio',
        }),
      );
      expect(result).toEqual(mockSavedUser);
    });

    it('should throw ForbiddenException when user tries to update another user', async () => {
      const updateUserDto: UpdateUserDto = { username: 'unauthorizedName' };

      await expect(
        service.update(mockUserId, updateUserDto, mockOtherUserId),
      ).rejects.toThrow(
        new ForbiddenException('You can only edit your own information'),
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should hash password and update user when password is provided', async () => {
      const updateUserDto: UpdateUserDto = {
        password: 'NewStrongPassword123!',
      };

      const mockExistingUser = {
        id: mockUserId,
        username: 'johndoe',
        password: 'oldHashedPassword',
      } as User;

      const mockSavedUser = {
        ...mockExistingUser,
        password: 'newHashedPassword123',
      };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingUser);
      mockUserRepository.save.mockResolvedValue(mockSavedUser);

      const result = await service.update(
        mockUserId,
        updateUserDto,
        mockUserId,
      );

      expect(spyFindOne).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({
          password: expect.any(String),
        }),
      );

      expect(mockUserRepository.save).not.toHaveBeenCalledWith(
        expect.objectContaining({
          password: 'NewStrongPassword123!',
        }),
      );
      expect(result).toEqual(mockSavedUser);
    });

    it('should throw NotFoundException if user is not found', async () => {
      const updateUserDto: UpdateUserDto = { username: 'updatedName' };

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`User with id ${mockUserId} does not exist`),
        );

      await expect(
        service.update(mockUserId, updateUserDto, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(spyFindOne).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });

    it('should throw ConflictException when updating email to an already existing email', async () => {
      const updateUserDto: UpdateUserDto = {
        email: 'taken@example.com',
      };

      const mockExistingUser = {
        id: mockUserId,
        username: 'johndoe',
        email: 'john@example.com',
      } as User;

      const mockOtherUserWithSameEmail = {
        id: mockOtherUserId,
        email: 'taken@example.com',
      } as User;

      jest.spyOn(service, 'findOne').mockResolvedValue(mockExistingUser);
      jest
        .spyOn(service, 'findOneByEmail')
        .mockResolvedValue(mockOtherUserWithSameEmail);

      await expect(
        service.update(mockUserId, updateUserDto, mockUserId),
      ).rejects.toThrow(
        new ConflictException('User with provided email already exists'),
      );

      expect(mockUserRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('updateRefreshToken', () => {
    const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

    it('should update refreshToken with provided string token', async () => {
      const mockRefreshToken = 'hashedRefreshTokenValue123';

      mockUserRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.updateRefreshToken(mockUserId, mockRefreshToken);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUserId, {
        currentHashedRefreshToken: mockRefreshToken,
      });
    });

    it('should update refreshToken with null when logging out', async () => {
      mockUserRepository.update.mockResolvedValue({ affected: 1 } as any);

      await service.updateRefreshToken(mockUserId, null);

      expect(mockUserRepository.update).toHaveBeenCalledWith(mockUserId, {
        currentHashedRefreshToken: null,
      });
    });
  });

  describe('remove', () => {
    const mockUserId = '123e4567-e89b-12d3-a456-426614174001';
    const mockOtherUserId = '123e4567-e89b-12d3-a456-426614174002';

    it('should remove and return the user when found', async () => {
      const mockUser = {
        id: mockUserId,
        email: 'john.doe@example.com',
        username: 'johndoe',
      } as User;

      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockUser);
      mockUserRepository.remove.mockResolvedValue(mockUser);

      const result = await service.remove(mockUserId, mockUserId);

      expect(spyFindOne).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.remove).toHaveBeenCalledWith(mockUser);
      expect(result).toEqual(mockUser);
    });

    it('should throw ForbiddenException when user tries to delete another user', async () => {
      await expect(service.remove(mockUserId, mockOtherUserId)).rejects.toThrow(
        new ForbiddenException('You can only delete your own information'),
      );

      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if user to remove does not exist', async () => {
      const spyFindOne = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(
          new NotFoundException(`User with id ${mockUserId} does not exist`),
        );

      await expect(service.remove(mockUserId, mockUserId)).rejects.toThrow(
        NotFoundException,
      );

      expect(spyFindOne).toHaveBeenCalledWith(mockUserId);
      expect(mockUserRepository.remove).not.toHaveBeenCalled();
    });
  });
});
