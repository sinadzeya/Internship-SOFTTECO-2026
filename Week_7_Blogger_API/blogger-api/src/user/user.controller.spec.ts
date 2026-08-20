import { Test, TestingModule } from '@nestjs/testing';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { User } from './entities/user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

describe('UserController', () => {
  let controller: UserController;

  const mockUserService = {
    findAll: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserController],
      providers: [
        {
          provide: UserService,
          useValue: mockUserService,
        },
      ],
    }).compile();

    controller = module.get<UserController>(UserController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

  describe('findAll', () => {
    it('should return an array of users from userService', async () => {
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

      mockUserService.findAll.mockResolvedValue(mockUsers);

      const result = await controller.findAll();

      expect(mockUserService.findAll).toHaveBeenCalledTimes(1);
      expect(result).toEqual(mockUsers);
    });
  });

  describe('findOne', () => {
    it('should return a user by id from userService', async () => {
      const mockUser = {
        id: mockUserId,
        email: 'john.doe@example.com',
        username: 'johndoe',
      } as User;

      mockUserService.findOne.mockResolvedValue(mockUser);

      const result = await controller.findOne(mockUserId);

      expect(mockUserService.findOne).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockUser);
    });
  });

  describe('update', () => {
    it('should update and return the user from userService', async () => {
      const updateUserDto: UpdateUserDto = {
        username: 'updatedUser',
        bio: 'Updated bio',
      };

      const mockUpdatedUser = {
        id: mockUserId,
        ...updateUserDto,
      } as User;

      mockUserService.update.mockResolvedValue(mockUpdatedUser);

      const result = await controller.update(mockUserId, updateUserDto);

      expect(mockUserService.update).toHaveBeenCalledWith(
        mockUserId,
        updateUserDto,
      );
      expect(result).toEqual(mockUpdatedUser);
    });
  });

  describe('remove', () => {
    it('should remove and return the user from userService', async () => {
      const mockRemovedUser = {
        id: mockUserId,
        email: 'john.doe@example.com',
      } as User;

      mockUserService.remove.mockResolvedValue(mockRemovedUser);

      const result = await controller.remove(mockUserId);

      expect(mockUserService.remove).toHaveBeenCalledWith(mockUserId);
      expect(result).toEqual(mockRemovedUser);
    });
  });
});
