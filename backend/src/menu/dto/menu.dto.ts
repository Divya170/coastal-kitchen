import { PartialType } from '@nestjs/mapped-types';
import { ArrayMaxSize, IsArray, IsBoolean, IsIn, IsInt, IsNotEmpty, IsOptional, IsString, Max, MaxLength, Min, ValidateIf } from 'class-validator';
import { LAYOUTS, TINTS } from '../menu-category.entity';
import { BADGES, DIETARY } from '../menu-item.entity';

const optionalText = () => ValidateIf((_o: unknown, v: unknown) => v !== null && v !== '');

export class CreateCategoryDto {
  @IsString() @IsNotEmpty({ message: 'Add the section name.' }) @MaxLength(60) name: string;
  @IsOptional() @IsString() @MaxLength(200) blurb?: string;
  @IsOptional() @IsString() @MaxLength(300) intro?: string;
  @IsOptional() @IsIn(LAYOUTS as unknown as string[], { message: 'Choose a layout.' }) layout?: string;
  @IsOptional() @IsString() @MaxLength(200) imageAlt?: string;
  @IsOptional() @IsIn(TINTS as unknown as string[], { message: 'Choose a placeholder tint.' }) tint?: string;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}
export class UpdateCategoryDto extends PartialType(CreateCategoryDto) {}

export class CreateItemDto {
  @IsInt({ message: 'Choose a menu section.' }) categoryId: number;
  @IsString() @IsNotEmpty({ message: 'Add the dish name.' }) @MaxLength(120) name: string;
  @IsOptional() @IsString() @MaxLength(600) description?: string;
  @IsOptional() @ValidateIf((_o, v) => v !== null) @IsInt({ message: 'Enter the price in cents, e.g. 2850 for $28.50.' })
  @Min(0, { message: 'The price can’t be negative.' }) @Max(10000000, { message: 'That price looks too large.' }) priceCents?: number | null;
  @IsOptional() @optionalText() @IsString() @MaxLength(40) priceNote?: string | null;
  @IsOptional() @IsArray() @ArrayMaxSize(4) @IsIn(DIETARY as unknown as string[], { each: true, message: 'Use GF, V, VG or DF.' }) dietary?: string[];
  @IsOptional() @optionalText() @IsIn(BADGES as unknown as string[], { message: 'Choose a label from the list.' }) badge?: string | null;
  @IsOptional() @IsString() @MaxLength(200) imageAlt?: string;
  @IsOptional() @optionalText() @IsIn(TINTS as unknown as string[]) tint?: string | null;
  @IsOptional() @IsBoolean() featured?: boolean;
  @IsOptional() @IsBoolean() highlight?: boolean;
  @IsOptional() @IsBoolean() isSample?: boolean;
  @IsOptional() @IsInt() sortOrder?: number;
  @IsOptional() @IsBoolean() published?: boolean;
}
export class UpdateItemDto extends PartialType(CreateItemDto) {}
