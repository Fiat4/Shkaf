import {Categories} from "./ProductCategoriesEnum";
import ApiResponse from "./ApiResponse"

export default interface IProduct {
    id: string;
    name: string;
    price: number;
    height: number ;
    width: number ;
    depth: number;
    category: keyof typeof Categories;
    description: string;
    materials: string;
    avatar: string;
    imgs: string[];
    viewsCount: number;
    popularityScore: number;
    created_at: string;
    updated_at: string;
}

export type ProductsResponse = ApiResponse<IProduct>