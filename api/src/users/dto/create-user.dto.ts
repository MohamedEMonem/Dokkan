// this is a plceholder file for create-user.dto.ts
// Establish Team Rule: All DTO classes must use `@ApiProperty()` decorators.

import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({
    example: 'user@example.com',
    description: 'The email of the user',
  })
  @IsEmail()
  @IsNotEmpty()
  email!: string;

  @ApiProperty({
    example: 'StrongPass123!',
    description: 'The password for the account',
    minLength: 6,
  })
  @IsString()
  @MinLength(6)
  password!: string;

  @ApiProperty({
    example: 'Mohamed',
    description: 'First name of the user',
  })
  @IsString()
  firstName!: string;
}