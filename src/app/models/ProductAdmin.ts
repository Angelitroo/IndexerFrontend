export interface ProductAdmin {
  id: any;
  title: string;
  discount: string;
  actualPrice: number;
  oldPrice?: number;
  image: string;
  rating?: string;
  delivery?: string;
  url: string;
  empresa: string;
  favorito: boolean;
}
