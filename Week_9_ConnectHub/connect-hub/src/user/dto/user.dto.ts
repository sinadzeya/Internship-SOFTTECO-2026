import { RegisterUserDto } from '../../auth/dto/auth.dto';
import { PartialType } from '@nestjs/swagger';

export class UpdateUserDto extends PartialType(RegisterUserDto) {}
