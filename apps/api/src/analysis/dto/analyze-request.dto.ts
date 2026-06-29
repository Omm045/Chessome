import { IsString, IsIn, IsOptional, ValidateNested, IsNumber, Min, Max } from 'class-validator';
import { Type } from 'class-transformer';
import { AnalyzeRequestDto, AnalyzeRequestOptionsDto } from '@chessome/types';

export class AnalyzeRequestOptions implements AnalyzeRequestOptionsDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(30)
  depth?: number;

  @IsOptional()
  @IsString()
  engineId?: string;

  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  multiPv?: number;
}

export class AnalyzeRequest implements AnalyzeRequestDto {
  @IsIn(['pgn', 'fen'])
  type!: 'pgn' | 'fen';

  @IsString()
  data!: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => AnalyzeRequestOptions)
  options?: AnalyzeRequestOptions;
}
