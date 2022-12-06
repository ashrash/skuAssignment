import { IsString, IsNotEmpty } from 'class-validator';

export class GetSKUDetailsDto {

    @IsString()
    @IsNotEmpty()
    public skuCode: string | undefined;
}