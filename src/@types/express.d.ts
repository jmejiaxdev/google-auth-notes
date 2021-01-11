declare namespace Express {
  interface User {
    id?: string;
    googleId: string;
    displayName: string;
    firstName: string;
    lastName: string;
    image: string;
    createdAt?: Date;
  }
}
