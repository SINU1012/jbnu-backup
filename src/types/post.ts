export interface Post {
  _id?: string;
  department: string;
  major: string;
  title: string;
  content: string;
  fileUrls: string[];
  createdAt?: Date;
  updatedAt?: Date;
}
