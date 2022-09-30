import { IsNotEmpty, MaxLength, IsEmail, MinLength } from 'class-validator';

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
}

export class LoginDto implements Pick<CreateUserDto, 'email' | 'password'> {
  email: string;
  password: string;
}
