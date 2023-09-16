export interface IProductCreate{
    name: string;
    image: File[] | null;
    description: string;
    categoryId:number;
}