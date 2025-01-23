export interface Dog {
  _id: string;
  name: string;
  breed: string;
  price: number;
  description: string;
  image: string;
}

export interface CartItem extends Dog {
  quantity: number;
}

export interface CustomerData {
  name: string;
  email: string;
} 