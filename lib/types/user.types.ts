export interface UserData {
  // describes the data that a user is expected expected to contain
  uid: string;
  bio?: string;
  email: string;
  photoURL?: string;
  profilePhoto: string;
  username?: string;
  website?: string;
  permissions: {
    user?: boolean;
    edit?: boolean;
    admin: boolean;
    level?: number;
  };
  communications?: {
    email: {comments: boolean; projects: boolean; updates: boolean};
    push: {comments: boolean; projects: boolean; updates: boolean};
  };
}
