import {Timestamp, FieldValue} from '@firebase/firestore-types';

// Blog related interfaces

/**Tags to be used for filtering and sorting */
interface blogTag {
  color: string;
  id: string;
  name: string;
}

/**Meta Tags for SEO and user experience */
interface relatedLink {
  url: string;
  name: string;
}

/**User who authored a blog post or blog reply */
interface Author {
  username?: string;
  email: string;
  uid: string;
  permissions: {admin: boolean; level: number};
  profilePhoto?: string;
}

/**Replies to blog posts  */
export interface BlogComment {
  author: Author;
  body: string;
  id: string;
  createdAt: Timestamp | FieldValue | number;
  updatedAt?: Timestamp | FieldValue | number;
  upVotes: UserVote[];
  downVotes: UserVote[];
  replies?: BlogComment[];
}

interface UserVote {
  userId: string;
  timestamp: Timestamp;
}

export interface BlogPost {
  id?: string;
  body: string;
  displayImage?: string;
  relatedLinks?: relatedLink[];
  replies?: BlogComment[];
  upvotes?: UserVote[];
  downVote?: UserVote[];
  status: 'archived' | 'draft' | 'published';
  summary: string;
  tags?: blogTag[];
  createdAt: Timestamp | FieldValue | number;
  updatedAt?: Timestamp | FieldValue | number;
  edited?: Timestamp;
  title: string;
  readingTime: string;
}
