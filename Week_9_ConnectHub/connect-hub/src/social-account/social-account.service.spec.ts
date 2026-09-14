import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import {
  ForbiddenException,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { SocialAccountService } from './social-account.service';
import { SocialAccount } from './entities/social-accounts.entity';
import { SocialAccountAccess } from './entities/social-accounts-accesses.entity';
import { SocialAccountRequest } from './entities/social-accounts-request.entity';
import {
  AddSocialAccountDto,
  GrantAccessDto,
  UpdateSocialAccountDto,
  CreateSocialAccountRequestDto,
} from './dto/social-account.dto';

describe('SocialAccountService', () => {
  let service: SocialAccountService;

  const mockSocialAccountRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockAccessRepository = {
    create: jest.fn(),
    save: jest.fn(),
    find: jest.fn(),
    findOne: jest.fn(),
    remove: jest.fn(),
  };

  const mockRequestRepository = {
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
        SocialAccountService,
        {
          provide: getRepositoryToken(SocialAccount),
          useValue: mockSocialAccountRepository,
        },
        {
          provide: getRepositoryToken(SocialAccountAccess),
          useValue: mockAccessRepository,
        },
        {
          provide: getRepositoryToken(SocialAccountRequest),
          useValue: mockRequestRepository,
        },
      ],
    }).compile();

    service = module.get<SocialAccountService>(SocialAccountService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('addAccount', () => {
    it('should create and save a new social account', async () => {
      const userId = 'user-123';
      const dto: AddSocialAccountDto = {
        platform: 'Twitter',
        accountName: '@test',
      };

      const createdAccount = { ...dto, owner: { id: userId } };
      const savedAccount = { id: 'account-1', ...createdAccount };

      mockSocialAccountRepository.create.mockReturnValue(createdAccount);
      mockSocialAccountRepository.save.mockResolvedValue(savedAccount);

      const result = await service.addAccount(userId, dto);

      expect(mockSocialAccountRepository.create).toHaveBeenCalledWith({
        ...dto,
        owner: { id: userId },
      });
      expect(mockSocialAccountRepository.save).toHaveBeenCalledWith(
        createdAccount,
      );
      expect(result).toEqual(savedAccount);
    });
  });

  describe('remove', () => {
    const userId = 'owner-123';
    const accountId = 'account-123';
    const mockAccount = {
      id: accountId,
      owner: { id: userId },
    } as SocialAccount;

    it('should successfully remove the account if user is the owner', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue(mockAccount);
      mockSocialAccountRepository.remove.mockResolvedValue(mockAccount);

      const result = await service.remove(userId, accountId);

      expect(mockSocialAccountRepository.findOne).toHaveBeenCalledWith({
        where: { id: accountId },
        relations: { owner: true },
      });
      expect(mockSocialAccountRepository.remove).toHaveBeenCalledWith(
        mockAccount,
      );
      expect(result).toEqual(mockAccount);
    });

    it('should throw NotFoundException if account does not exist', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue(null);

      await expect(service.remove(userId, accountId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not the owner', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue({
        ...mockAccount,
        owner: { id: 'other-user' },
      });

      await expect(service.remove(userId, accountId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('update', () => {
    const userId = 'owner-123';
    const accountId = 'account-123';
    const updateDto: UpdateSocialAccountDto = { accountName: 'new-name' };
    const mockAccount = {
      id: accountId,
      accountName: 'old-name',
      owner: { id: userId },
    } as SocialAccount;

    it('should update and save the account if user is the owner', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue({ ...mockAccount });
      mockSocialAccountRepository.save.mockImplementation((acc) =>
        Promise.resolve(acc),
      );

      const result = await service.update(userId, accountId, updateDto);

      expect(mockSocialAccountRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ accountName: 'new-name' }),
      );
      expect(result.accountName).toEqual('new-name');
    });

    it('should throw NotFoundException if account not found', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue(null);

      await expect(
        service.update(userId, accountId, updateDto),
      ).rejects.toThrow(NotFoundException);
    });

    it('should throw ForbiddenException if user is not owner', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue({
        ...mockAccount,
        owner: { id: 'different-user' },
      });

      await expect(
        service.update(userId, accountId, updateDto),
      ).rejects.toThrow(ForbiddenException);
    });
  });

  describe('getMyAccounts', () => {
    it('should return user accounts with client relations', async () => {
      const userId = 'user-1';
      const expectedAccounts = [{ id: 'acc-1' }] as SocialAccount[];

      mockSocialAccountRepository.find.mockResolvedValue(expectedAccounts);

      const result = await service.getMyAccounts(userId);

      expect(mockSocialAccountRepository.find).toHaveBeenCalledWith({
        where: { owner: { id: userId } },
        relations: {
          accesses: {
            client: true,
          },
        },
      });
      expect(result).toEqual(expectedAccounts);
    });
  });

  describe('grantOrUpdateAccess', () => {
    const ownerId = 'owner-1';
    const dto: GrantAccessDto = {
      socialAccountId: 'acc-1',
      clientId: 'client-1',
      clientHasAccess: true,
    };

    const mockAccount = {
      id: dto.socialAccountId,
      owner: { id: ownerId },
    } as SocialAccount;

    it('should update existing access if found', async () => {
      const existingAccess = {
        id: 'access-1',
        clientHasAccess: false,
      } as SocialAccountAccess;

      mockSocialAccountRepository.findOne.mockResolvedValue(mockAccount);
      mockAccessRepository.findOne.mockResolvedValue(existingAccess);
      mockAccessRepository.save.mockResolvedValue({
        ...existingAccess,
        clientHasAccess: true,
      });

      const result = await service.grantOrUpdateAccess(ownerId, dto);

      expect(result.clientHasAccess).toBe(true);
      expect(mockAccessRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ clientHasAccess: true }),
      );
    });

    it('should create new access if not found', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue(mockAccount);
      mockAccessRepository.findOne.mockResolvedValue(null);
      mockAccessRepository.create.mockReturnValue({ ...dto });
      mockAccessRepository.save.mockResolvedValue({
        id: 'new-access',
        ...dto,
      });

      const result = await service.grantOrUpdateAccess(ownerId, dto);

      expect(mockAccessRepository.create).toHaveBeenCalledWith({
        owner: { id: ownerId },
        client: { id: dto.clientId },
        socialAccount: { id: dto.socialAccountId },
        clientHasAccess: dto.clientHasAccess,
      });
      expect(result).toHaveProperty('id', 'new-access');
    });

    it('should throw NotFoundException when account does not exist', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue(null);

      await expect(service.grantOrUpdateAccess(ownerId, dto)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException when user is not the account owner', async () => {
      mockSocialAccountRepository.findOne.mockResolvedValue({
        id: dto.socialAccountId,
        owner: { id: 'other-owner' },
      });

      await expect(service.grantOrUpdateAccess(ownerId, dto)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });

  describe('getSharedByMe', () => {
    it('should return accesses shared by owner', async () => {
      const ownerId = 'owner-1';
      const mockResult = [{ id: 'access-1' }] as SocialAccountAccess[];

      mockAccessRepository.find.mockResolvedValue(mockResult);

      const result = await service.getSharedByMe(ownerId);

      expect(mockAccessRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            clientHasAccess: true,
            socialAccount: {
              owner: {
                id: ownerId,
              },
            },
          },
        }),
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('getSharedWithMe', () => {
    it('should return accesses shared with client', async () => {
      const clientId = 'client-1';
      const mockResult = [{ id: 'access-1' }] as SocialAccountAccess[];

      mockAccessRepository.find.mockResolvedValue(mockResult);

      const result = await service.getSharedWithMe(clientId);

      expect(mockAccessRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            client: { id: clientId },
            clientHasAccess: true,
          },
        }),
      );
      expect(result).toEqual(mockResult);
    });
  });

  describe('createRequest', () => {
    const clientId = 'client-1';
    const dto: CreateSocialAccountRequestDto = { ownerId: 'owner-1' };

    it('should create and save request if no existing access or pending request', async () => {
      mockAccessRepository.findOne.mockResolvedValue(null);
      mockRequestRepository.findOne.mockResolvedValue(null);

      const mockRequest = { id: 'req-1', fulfilled: false };
      mockRequestRepository.create.mockReturnValue(mockRequest);
      mockRequestRepository.save.mockResolvedValue(mockRequest);

      const result = await service.createRequest(clientId, dto);

      expect(mockRequestRepository.create).toHaveBeenCalledWith({
        owner: { id: dto.ownerId },
        client: { id: clientId },
        fulfilled: false,
      });
      expect(result).toEqual(mockRequest);
    });

    it('should throw ConflictException if client already has active access', async () => {
      mockAccessRepository.findOne.mockResolvedValue({ id: 'acc-1' } as any);

      await expect(service.createRequest(clientId, dto)).rejects.toThrow(
        ConflictException,
      );
    });

    it('should throw ConflictException if request is already pending', async () => {
      mockAccessRepository.findOne.mockResolvedValue(null);
      mockRequestRepository.findOne.mockResolvedValue({ id: 'req-1' } as any);

      await expect(service.createRequest(clientId, dto)).rejects.toThrow(
        ConflictException,
      );
    });
  });

  describe('getRequestsForOwner', () => {
    it('should fetch pending requests for owner', async () => {
      const ownerId = 'owner-1';
      const mockRequests = [{ id: 'req-1' }] as SocialAccountRequest[];

      mockRequestRepository.find.mockResolvedValue(mockRequests);

      const result = await service.getRequestsForOwner(ownerId);

      expect(mockRequestRepository.find).toHaveBeenCalledWith(
        expect.objectContaining({
          where: {
            owner: { id: ownerId },
            fulfilled: false,
          },
        }),
      );
      expect(result).toEqual(mockRequests);
    });
  });

  describe('markAsFulfilled', () => {
    const userId = 'owner-1';
    const requestId = 'req-1';
    const mockRequest = {
      id: requestId,
      fulfilled: false,
      owner: { id: userId },
    } as SocialAccountRequest;

    it('should mark request as fulfilled and save', async () => {
      mockRequestRepository.findOne.mockResolvedValue({ ...mockRequest });
      mockRequestRepository.save.mockImplementation((req) =>
        Promise.resolve(req),
      );

      const result = await service.markAsFulfilled(userId, requestId);

      expect(result.fulfilled).toBe(true);
      expect(mockRequestRepository.save).toHaveBeenCalledWith(
        expect.objectContaining({ fulfilled: true }),
      );
    });

    it('should throw NotFoundException if request not found', async () => {
      mockRequestRepository.findOne.mockResolvedValue(null);

      await expect(service.markAsFulfilled(userId, requestId)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw ForbiddenException if user is not request owner', async () => {
      mockRequestRepository.findOne.mockResolvedValue({
        ...mockRequest,
        owner: { id: 'other-user' },
      });

      await expect(service.markAsFulfilled(userId, requestId)).rejects.toThrow(
        ForbiddenException,
      );
    });
  });
});
