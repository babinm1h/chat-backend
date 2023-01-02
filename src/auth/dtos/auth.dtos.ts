import {
  IsNotEmpty,
  MaxLength,
  IsEmail,
  MinLength,
  IsString,
} from 'class-validator';
import { TGender } from 'src/typeorm/entities/user.entity';

export class CreateUserDto {
  @IsEmail()
  @IsNotEmpty()
  readonly email: string;

  @IsNotEmpty()
  @MaxLength(32)
  @MinLength(3)
  readonly password: string;

  @IsNotEmpty()
  readonly firstName: string;

  @IsNotEmpty()
  readonly lastName: string;

  @IsNotEmpty()
  @IsString()
  readonly country: string;

  @IsNotEmpty()
  @IsString()
  readonly gender: TGender;
}

export class LoginDto implements Pick<CreateUserDto, 'email' | 'password'> {
  email: string;
  password: string;
}
