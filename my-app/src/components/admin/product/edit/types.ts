export interface IProductEdit {
    id:number;
    name: string;
    image: File[] | null;
    description: string;
    categoryId:number;
}