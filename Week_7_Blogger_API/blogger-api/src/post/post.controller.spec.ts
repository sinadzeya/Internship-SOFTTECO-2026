import { Test, TestingModule } from '@nestjs/testing';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { CreatePostDto } from './dto/create-post.dto';
import { UpdatePostDto } from './dto/update-post.dto';

describe('PostController', () => {
  let controller: PostController;

  const mockPostService = {
    create: jest.fn(),
    findAll: jest.fn(),
    findByUserId: jest.fn(),
    findOne: jest.fn(),
    update: jest.fn(),
    remove: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PostController],
      providers: [
        {
          provide: PostService,
          useValue: mockPostService,
        },
      ],
    }).compile();

    controller = module.get<PostController>(PostController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });

  describe('create', () => {
    it('should pass CreatePostDto to postService.create and return created post', async () => {
      const createPostDto: CreatePostDto = {
        title: 'Title of the post',
        content: 'Content of the post',
      };

      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';

      const mockCreatedPost = {
        id: '123e4567-e89b-12d3-a456-426614174001',
        ...createPostDto,
        userId: mockUserId,
      };

      const mockReq = {
        user: {
          userId: mockUserId,
        },
      } as any;

      mockPostService.create.mockResolvedValue(mockCreatedPost);

      const result = await controller.create(createPostDto, mockReq);

      expect(result).toEqual(mockCreatedPost);
      expect(mockPostService.create).toHaveBeenCalledWith(
        createPostDto,
        mockUserId,
      );
    });
  });

  describe('findAll', () => {
    it('should call postService.findAll and return an array of posts', async () => {
      const mockPosts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'First Post',
          content: 'Content 1',
          userId: '123e4567-e89b-12d3-a456-426614174000',
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'Second Post',
          content: 'Content 2',
          userId: '123e4567-e89b-12d3-a456-426614174000',
        },
      ];

      mockPostService.findAll.mockResolvedValue(mockPosts);

      const result = await controller.findAll();

      expect(result).toEqual(mockPosts);
      expect(mockPostService.findAll).toHaveBeenCalledWith();
    });
  });

  describe('findByUserId', () => {
    it('should pass userId to postService.findByUserId and return user posts', async () => {
      const mockUserId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPosts = [
        {
          id: '123e4567-e89b-12d3-a456-426614174001',
          title: 'User Post 1',
          userId: mockUserId,
        },
        {
          id: '123e4567-e89b-12d3-a456-426614174002',
          title: 'User Post 2',
          userId: mockUserId,
        },
      ];

      mockPostService.findByUserId.mockResolvedValue(mockPosts);

      const result = await controller.findByUserId(mockUserId);

      expect(result).toEqual(mockPosts);
      expect(mockPostService.findByUserId).toHaveBeenCalledWith(mockUserId);
    });
  });

  describe('findOne', () => {
    it('should pass id to postService.findOne and return single post', async () => {
      const mockPostId = '123e4567-e89b-12d3-a456-426614174000';
      const mockPost = {
        id: mockPostId,
        title: 'Single Post',
        content: 'Post Content',
      };

      mockPostService.findOne.mockResolvedValue(mockPost);

      const result = await controller.findOne(mockPostId);

      expect(result).toEqual(mockPost);
      expect(mockPostService.findOne).toHaveBeenCalledWith(mockPostId);
    });
  });

  describe('update', () => {
    it('should pass id, updatePostDto and userId to postService.update and return updated post', async () => {
      const mockPostId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174001';

      const updatePostDto: UpdatePostDto = {
        title: 'Updated Title',
        content: 'Updated Content',
      };

      const mockReq = {
        user: {
          userId: mockUserId,
        },
      } as any;

      const mockUpdatedPost = {
        id: mockPostId,
        ...updatePostDto,
        userId: mockUserId,
      };

      mockPostService.update.mockResolvedValue(mockUpdatedPost);

      const result = await controller.update(
        mockPostId,
        updatePostDto,
        mockReq,
      );

      expect(result).toEqual(mockUpdatedPost);
      expect(mockPostService.update).toHaveBeenCalledWith(
        mockPostId,
        updatePostDto,
        mockUserId,
      );
    });
  });

  describe('remove', () => {
    it('should pass id and userId to postService.remove and return removed post', async () => {
      const mockPostId = '123e4567-e89b-12d3-a456-426614174000';
      const mockUserId = '123e4567-e89b-12d3-a456-426614174001';

      const mockReq = {
        user: {
          userId: mockUserId,
        },
      } as any;

      const mockRemovedPost = {
        id: mockPostId,
        title: 'Post to delete',
        userId: mockUserId,
      };

      mockPostService.remove.mockResolvedValue(mockRemovedPost);

      const result = await controller.remove(mockPostId, mockReq);

      expect(result).toEqual(mockRemovedPost);
      expect(mockPostService.remove).toHaveBeenCalledWith(
        mockPostId,
        mockUserId,
      );
      expect(mockPostService.remove).toHaveBeenCalledTimes(1);
    });
  });
});
