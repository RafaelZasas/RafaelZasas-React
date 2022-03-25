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
interface BlogComment {
  author: Author;
  comment: string;
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  upvotes: UserVote[];
  downVote: UserVote[];
  replies?: BlogComment[];
}

interface UserVote {
  userId: string;
  timestamp: Timestamp;
}

export interface BlogPost {
  body: string;
  displayImage?: string;
  relatedLinks?: relatedLink[];
  replies?: BlogComment[];
  upvotes?: UserVote[];
  downVote?: UserVote[];
  status: 'archived' | 'draft' | 'published';
  summary: string;
  tags?: blogTag[];
  createdAt: Timestamp | FieldValue;
  updatedAt?: Timestamp | FieldValue;
  edited?: Timestamp;
  title: string;
  readingTime: string;
}
