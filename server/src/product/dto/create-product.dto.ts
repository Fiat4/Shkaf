import { ProductCategory } from "@prisma/client";
import { Type } from "class-transformer";
import { ArrayMaxSize, ArrayMinSize, IsArray, IsEnum, isNotEmpty, IsNotEmpty, IsNumber, IsNumberString, IsOptional, IsString, ValidateNested } from "class-validator"


export class CreateProductDto {
    @IsString({message: 'Имя должны быть строкой'})
    @IsNotEmpty({message: 'Имя не должно быть пустым'})
    name: string;

    // @IsNumberString({}, { 
    //     message: 'Цена должна быть строкой, содержащей число' 
    // })
    @IsNotEmpty({message: 'Цена не должна быть пустой'})
    @Type(() => Number)
    @IsNumber({}, { 
        message: 'Цена должна быть числом' 
    })
    price: number;

    @IsOptional()
    // @IsNumberString({}, { 
    //     message: 'Высота должна быть строкой, содержащей число' 
    // })
    @Type(() => Number)
    @IsNumber({}, { 
        message: 'Высота должна быть числом' 
    })
    height?: number;

    @IsOptional()
    // @IsNumberString({}, { 
    //     message: 'Ширина должна быть строкой, содержащей число' 
    // })
    @Type(() => Number)
    @IsNumber({}, { 
        message: 'Ширина должна быть числом' 
    })
    width?: number;
    
    @IsOptional()
    // @IsNumberString({}, { 
    //     message: 'Глубина должна быть строкой, содержащей число' 
    // })
    @Type(() => Number)
    @IsNumber({}, { 
        message: 'Глубина должна быть числом' 
    })
    depth?: number;

    @IsNotEmpty({ message: 'Категория обязательна' })
    @IsEnum(ProductCategory, { message: 'Неверная категория продукта' })
    category: ProductCategory;

    @IsNotEmpty({message: 'Поле описания не должно быть пустым'})
    @IsString({message: "Описание должно быть строкой"})
    description: string;

    @IsString({ message: 'Каждый материал должен быть строкой' })
    // @Type(() => String)
    materials: string;
}

