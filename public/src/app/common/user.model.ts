export interface User {
  id?: string;
  roles: {
    isAdmin: boolean;
    isTeacher: boolean;
    isStudent: boolean;
    isVisitor: boolean;
  };
  firstName: string;
  lastName: string;
  username: string;
  avatar: string;
  password: string;
}
