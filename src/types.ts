export interface Post {
  _id?: string;
  title: string;
  content: string;
  fileUrls: string[];
  department: string;
  createdAt?: string;
  updatedAt?: string;
}
