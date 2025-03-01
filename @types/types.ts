export interface User {
  id?: string;
  userAgent: string;
  fullName: string;
  image: string;
  color: string;
  position: {
    top:string;
    left:string;
  }
};
