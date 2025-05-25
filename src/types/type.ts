export interface Cat {
  id: number;
  name: string;
  age: number;
  breed: string;
  description: string;
  health_status: string;
  status: string;
  image: string | null;
}

export interface Application {
  id: number;
  cat_id: number;
  cat_name: string;
  user_id: number;
  user_name: string;
  message: string;
  status: 'pending' | 'approved' | 'rejected';
  created_at: string;
}

export interface User {
  id: number;
  name: string;
  roles: string[];
}
