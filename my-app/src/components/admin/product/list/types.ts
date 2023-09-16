

export interface IImagesItem {
  id:number;
  productId:number;
 image:string;
}
export interface IProductItem{
  id:number;
    name: string;
  images: IImagesItem[];
    description: string;
    categoryId:number;
}