import {
  Injectable,
  ForbiddenException,
  Logger,
  NotFoundException,
  ConflictException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from './entities/social-accounts.entity';
import { SocialAccountAccess } from './entities/social-accounts-accesses.entity';
import {
  AddSocialAccountDto,
  CreateSocialAccountRequestDto,
  GrantAccessDto,
  UpdateSocialAccountDto,
} from './dto/social-account.dto';
import { SocialAccountRequest } from './entities/social-accounts-request.entity';

@Injectable()
export class SocialAccountService {
  private readonly logger = new Logger(SocialAccountService.name);

  constructor(
    @InjectRepository(SocialAccount)
    private readonly accountRepository: Repository<SocialAccount>,
    @InjectRepository(SocialAccountAccess)
    private readonly accessRepository: Repository<SocialAccountAccess>,
    @InjectRepository(SocialAccountRequest)
    private readonly requestRepository: Repository<SocialAccountRequest>,
  ) {}

  async addAccount(userId: string, dto: AddSocialAccountDto) {
    this.logger.debug(`Start add social account process for user: ${userId}`);
    const account = this.accountRepository.create({
      ...dto,
      owner: { id: userId },
    });

    const savedAccount = await this.accountRepository.save(account);
    this.logger.log(`Social account added successfully for user: ${userId}`);

    return savedAccount;
  }

  async remove(userId: string, accountId: string) {
    this.logger.debug(`Removing social account with id: ${accountId}`);

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { owner: true },
    });

    if (!account) {
      this.logger.warn(
        `Delete failed: Social account with id ${accountId} does not exist`,
      );
      throw new NotFoundException(
        `Social account with id ${accountId} does not exist`,
      );
    }

    const authorId = account.owner.id;

    if (authorId !== userId) {
      this.logger.warn(
        `Delete forbidden: User ${userId} tried to delete social account ${accountId} owned by ${authorId}`,
      );
      throw new ForbiddenException(
        'You can only delete your own social account',
      );
    }

    const removedAccount = await this.accountRepository.remove(account);
    this.logger.debug(`Social account ${accountId} removed successfully`);

    return removedAccount;
  }

  async update(userId: string, accountId: string, dto: UpdateSocialAccountDto) {
    this.logger.debug(`Updating social account with id: ${accountId}`);

    const account = await this.accountRepository.findOne({
      where: { id: accountId },
      relations: { owner: true },
    });

    if (!account) {
      this.logger.warn(
        `Update failed: Social account with id ${accountId} does not exist`,
      );
      throw new NotFoundException(
        `Social account with id ${accountId} does not exist`,
      );
    }

    const authorId = account.owner.id;

    if (authorId !== userId) {
      this.logger.warn(
        `Update forbidden: User ${userId} tried to update social account ${accountId} owned by ${authorId}`,
      );
      throw new ForbiddenException(
        'You can only update your own social account',
      );
    }

    Object.assign(account, dto);

    const updatedAccount = await this.accountRepository.save(account);
    this.logger.debug(`Social account ${accountId} updated successfully`);

    return updatedAccount;
  }

  async getMyAccounts(userId: string) {
    this.logger.debug(`Fetching all social accounts from user: ${userId}`);
    return await this.accountRepository.find({
      where: { owner: { id: userId } },
      relations: {
        accesses: {
          client: true,
        },
      },
    });
  }

  async grantOrUpdateAccess(ownerId: string, dto: GrantAccessDto) {
    this.logger.debug(
      `Attempting to grant/update account ${dto.socialAccountId} access to client ${dto.clientId} by owner ${ownerId}`,
    );

    const account = await this.accountRepository.findOne({
      where: { id: dto.socialAccountId },
      relations: { owner: true },
    });

    if (!account) {
      this.logger.warn(
        `Fetching failed: Account with id ${dto.socialAccountId} does not exist`,
      );
      throw new NotFoundException(
        `Account with id ${dto.socialAccountId} does not exist`,
      );
    }

    if (account.owner.id !== ownerId) {
      this.logger.warn(
        `Update forbidden: User ${ownerId} tried to grant/update access to account ${dto.socialAccountId} owned by ${account.owner.id}`,
      );
      throw new ForbiddenException(
        'You can only grant/update access to your own accounts',
      );
    }

    let access = await this.accessRepository.findOne({
      where: {
        owner: { id: ownerId },
        client: { id: dto.clientId },
        socialAccount: { id: dto.socialAccountId },
      },
    });

    if (access) {
      access.clientHasAccess = dto.clientHasAccess;
    } else {
      access = this.accessRepository.create({
        owner: { id: ownerId },
        client: { id: dto.clientId },
        socialAccount: { id: dto.socialAccountId },
        clientHasAccess: dto.clientHasAccess,
      });
    }

    const savedAccess = await this.accessRepository.save(access);
    this.logger.debug(
      `Access for account ${dto.socialAccountId} granted/updated successfully`,
    );

    return savedAccess;
  }

  async getSharedByMe(ownerId: string) {
    this.logger.debug(
      `Fetching all social accounts with access granted to client: ${ownerId}`,
    );

    return this.accessRepository.find({
      where: {
        clientHasAccess: true,
        socialAccount: {
          owner: {
            id: ownerId,
          },
        },
      },
      relations: {
        client: true,
        socialAccount: {
          owner: true,
        },
      },
      select: {
        id: true,
        clientHasAccess: true,
        createdAt: true,
        client: {
          id: true,
          username: true,
          email: true,
        },
        socialAccount: {
          id: true,
          platform: true,
          accountName: true,
        },
      },
    });
  }

  async getSharedWithMe(clientId: string) {
    this.logger.debug(
      `Fetching all social accounts with access granted to client: ${clientId}`,
    );

    return await this.accessRepository.find({
      where: {
        client: { id: clientId },
        clientHasAccess: true,
      },
      relations: {
        socialAccount: {
          owner: true,
        },
      },
      select: {
        id: true,
        clientHasAccess: true,
        createdAt: true,
        socialAccount: {
          id: true,
          platform: true,
          accountName: true,
          owner: {
            id: true,
            username: true,
            email: true,
          },
        },
      },
    });
  }

  async createRequest(
    clientId: string,
    dto: CreateSocialAccountRequestDto,
  ): Promise<SocialAccountRequest> {
    this.logger.debug(
      `Start add social account request process for user: ${clientId}`,
    );

    const existingAccess = await this.accessRepository.findOne({
      where: {
        owner: { id: dto.ownerId },
        client: { id: clientId },
        clientHasAccess: true,
      },
    });

    if (existingAccess) {
      this.logger.warn(
        `Request creation rejected: Client ${clientId} already has active access to owner ${dto.ownerId}`,
      );
      throw new ConflictException(
        'You already have access to this user accounts',
      );
    }

    const existingPendingRequest = await this.requestRepository.findOne({
      where: {
        owner: { id: dto.ownerId },
        client: { id: clientId },
        fulfilled: false,
      },
    });

    if (existingPendingRequest) {
      this.logger.warn(
        `Request creation rejected: Pending request already exists from client ${clientId} to owner ${dto.ownerId}`,
      );
      throw new ConflictException('A request to this user is already pending');
    }

    const request = this.requestRepository.create({
      owner: { id: dto.ownerId },
      client: { id: clientId },
      fulfilled: false,
    });

    const savedRequest = await this.requestRepository.save(request);
    this.logger.log(
      `Social account request added successfully for user: ${clientId}`,
    );

    return savedRequest;
  }

  async getRequestsForOwner(ownerId: string): Promise<SocialAccountRequest[]> {
    this.logger.debug(`Fetching all social accounts request for: ${ownerId}`);
    return await this.requestRepository.find({
      where: {
        owner: { id: ownerId },
        fulfilled: false,
      },
      relations: {
        client: true,
        owner: true,
      },
      select: {
        id: true,
        owner: {
          id: true,
          username: true,
          email: true,
        },
        client: {
          id: true,
          username: true,
          email: true,
        },
        fulfilled: true,
        createdAt: true,
      },
    });
  }

  async markAsFulfilled(
    userId: string,
    requestId: string,
  ): Promise<SocialAccountRequest> {
    this.logger.debug(
      `Start fulfill request process for request: ${requestId}`,
    );
    const request = await this.requestRepository.findOne({
      where: { id: requestId },
      relations: { owner: true },
    });

    if (!request) {
      this.logger.warn(
        `Fetching failed: Request with id ${requestId} does not exist`,
      );
      throw new NotFoundException(
        `Request with id ${requestId} does not exist`,
      );
    }

    if (request.owner.id !== userId) {
      this.logger.warn(
        `Update forbidden: User ${userId} tried to fulfill request addressed to ${request.owner.id}`,
      );
      throw new ForbiddenException(
        'You can only fulfill request addressed to you',
      );
    }

    request.fulfilled = true;

    const savedRequest = await this.requestRepository.save(request);
    this.logger.log(`Request ${requestId} fulfilled successfully`);

    return savedRequest;
  }
}
