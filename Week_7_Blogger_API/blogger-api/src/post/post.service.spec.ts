import { Test, TestingModule } from '@nestjs/testing';
import { PostService } from './post.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Post } from './entities/post.entity';
import { CreatePostDto } from './dto/create-post.dto';
import { ForbiddenException, NotFoundException } from '@nestjs/common';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostService', () => {
  let service: PostService;

  const mockPostRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    jest.clearAllMocks();

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        {
          provide: getRepositoryToken(Post),
          useValue: mockPostRepository,
        },
      ],
    }).compile();

    service = module.get<PostService>(PostService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create new post and save it via postRepository.save', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

      const createPostDto: CreatePostDto = {
        title: 'Title of the post',
        content: 'Content of the post',
      };

      const mockPostEntity = {
        ...createPostDto,
        userId: mockUserId,
      };

      const mockSavedPost = {
        id: '123e4567-e89b-12d3-a456-426614174000',
        ...createPostDto,
      } as any;

      mockPostRepository.create.mockReturnValue(mockPostEntity);
      mockPostRepository.save.mockResolvedValue(mockSavedPost);

      const result = await service.create(createPostDto, mockUserId);

      expect(result).toEqual(mockSavedPost);
      expect(mockPostRepository.create).toHaveBeenCalledWith({
        ...createPostDto,
        userId: mockUserId,
      });
      expect(mockPostRepository.save).toHaveBeenCalledWith(mockPostEntity);
    });
  });

  describe('findAll', () => {
    it('should return an array of posts with user relation', async () => {
      const mockPosts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'First Post',
          content: 'Content 1',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174001',
            email: 'test1@example.com',
          },
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Second Post',
          content: 'Content 2',
          user: {
            id: '123e4567-e89b-12d3-a456-426614174002',
            email: 'test2@example.com',
          },
        },
      ] as any;

      mockPostRepository.find.mockResolvedValue(mockPosts);

      const result = await service.findAll();

      expect(result).toEqual(mockPosts);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        relations: {
          user: true,
        },
      });
    });
  });

  describe('findByUserId', () => {
    it('should return posts belonging to a specific user with user relation', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPosts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'User Post 1',
          content: 'Content 1',
          userId: mockUserId,
          user: { id: mockUserId, email: 'test@example.com' },
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'User Post 2',
          content: 'Content 2',
          userId: mockUserId,
          user: { id: mockUserId, email: 'test@example.com' },
        },
      ] as any;

      mockPostRepository.find.mockResolvedValue(mockPosts);

      const result = await service.findByUserId(mockUserId);

      expect(result).toEqual(mockPosts);
      expect(mockPostRepository.find).toHaveBeenCalledWith({
        where: { userId: mockUserId },
        relations: {
          user: true,
        },
      });
      expect(mockPostRepository.find).toHaveBeenCalledTimes(1);
    });
  });

  describe('findOne', () => {
    const mockPostId = '123e4567-e89b-12d3-a456-426614174000';

    it('should return a post if it exists', async () => {
      const mockPost = {
        id: mockPostId,
        title: 'Test Post',
        content: 'Test Content',
        user: {
          id: '123e4567-e89b-12d3-a456-426614174000',
          email: 'test@example.com',
        },
      } as any;

      mockPostRepository.findOne.mockResolvedValue(mockPost);

      const result = await service.findOne(mockPostId);

      expect(result).toEqual(mockPost);
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPostId },
        relations: {
          user: true,
        },
      });
    });

    it('should throw NotFoundException if post does not exist', async () => {
      mockPostRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne(mockPostId)).rejects.toThrow(
        NotFoundException,
      );
      expect(mockPostRepository.findOne).toHaveBeenCalledWith({
        where: { id: mockPostId },
        relations: {
          user: true,
        },
      });
    });
  });

  describe('update', () => {
    const mockPostId = '123e4567-e89b-12d3-a456-426614174000';
    const mockUserId = '123e4567-e89b-12d3-a456-426614174001';
    const mockOtherUserId = '123e4567-e89b-12d3-a456-426614174002';

    const updatePostDto: UpdatePostDto = {
      title: 'Updated Title',
      content: 'Updated Content',
    };

    const mockExistingPost = {
      id: mockPostId,
      title: 'Old Title',
      content: 'Old Content',
      user: {
        id: mockUserId,
        email: 'test@example.com',
      },
    } as any;

    it('should successfully update and return the post if user is the author', async () => {
      const updatedPostEntity = {
        ...mockExistingPost,
        ...updatePostDto,
      };

      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingPost);
      mockPostRepository.save.mockResolvedValue(updatedPostEntity);

      const result = await service.update(
        mockPostId,
        updatePostDto,
        mockUserId,
      );

      expect(result).toEqual(updatedPostEntity);
      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.save).toHaveBeenCalledWith(
        expect.objectContaining(updatePostDto),
      );
    });

    it('should throw ForbiddenException if user is not the author of the post', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingPost);

      await expect(
        service.update(mockPostId, updatePostDto, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);

      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Post not found'));

      await expect(
        service.update(mockPostId, updatePostDto, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.save).not.toHaveBeenCalled();
    });
  });

  describe('remove', () => {
    const mockPostId = '123e4567-e89b-12d3-a456-426614174000';
    const mockUserId = '123e4567-e89b-12d3-a456-426614174001';
    const mockOtherUserId = '123e4567-e89b-12d3-a456-426614174002';

    const mockExistingPost = {
      id: mockPostId,
      title: 'Test Post',
      content: 'Test Content',
      user: {
        id: mockUserId,
        email: 'test@example.com',
      },
    } as any;

    it('should successfully remove and return the post if user is the author', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingPost);

      mockPostRepository.remove.mockResolvedValue(mockExistingPost);

      const result = await service.remove(mockPostId, mockUserId);

      expect(result).toEqual(mockExistingPost);
      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.remove).toHaveBeenCalledWith(mockExistingPost);
    });

    it('should throw ForbiddenException if user is not the author of the post', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockResolvedValue(mockExistingPost);

      await expect(() =>
        service.remove(mockPostId, mockOtherUserId),
      ).rejects.toThrow(ForbiddenException);

      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.remove).not.toHaveBeenCalled();
    });

    it('should throw NotFoundException if post does not exist', async () => {
      const findOneSpy = jest
        .spyOn(service, 'findOne')
        .mockRejectedValue(new NotFoundException('Post not found'));

      await expect(() =>
        service.remove(mockPostId, mockUserId),
      ).rejects.toThrow(NotFoundException);

      expect(findOneSpy).toHaveBeenCalledWith(mockPostId);
      expect(mockPostRepository.remove).not.toHaveBeenCalled();
    });
  });
});
