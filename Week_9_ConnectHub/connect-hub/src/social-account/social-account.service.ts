import {
  Injectable,
  ForbiddenException,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { SocialAccount } from './entities/social-accounts.entity';
import { SocialAccountAccess } from './entities/social-accounts-access.entity';
import { AddSocialAccountDto, GrantAccessDto } from './dto/social-account.dto';

@Injectable()
export class SocialAccountService {
  private readonly logger = new Logger(SocialAccountService.name);

  constructor(
    @InjectRepository(SocialAccount)
    private readonly accountRepository: Repository<SocialAccount>,
    @InjectRepository(SocialAccountAccess)
    private readonly accessRepository: Repository<SocialAccountAccess>,
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
}
