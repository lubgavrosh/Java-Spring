export interface IProductCreate {
    name: string,
    description: string,
    price: number,
    category_id: number,
    images: Array<File>,
}