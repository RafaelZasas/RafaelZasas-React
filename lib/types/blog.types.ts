/** Blog related interfaces */
import {Timestamp, FieldValue} from '@firebase/firestore-types';

/**Tags to be used for filtering and sorting */
export interface BlogTag {
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

/** Comments on blog posts  */
export interface BlogComment {
  author: Author;
  body: string;
  id: string;
  createdAt: Timestamp | FieldValue | number;
  updatedAt?: Timestamp | FieldValue | number;
  upVotes: string[];
  downVotes: string[];
  replies?: BlogComment[];
}

/** Blog Posts without comments */
export interface BlogPost {
  id?: string;
  body: string;
  displayImage?: string;
  relatedLinks?: relatedLink[];
  replies?: BlogComment[];
  upVotes: string[];
  downVotes: string[];
  status: 'archived' | 'draft' | 'published';
  summary: string;
  tags?: BlogTag[];
  createdAt: Timestamp | FieldValue | number;
  updatedAt?: Timestamp | FieldValue | number;
  edited?: Timestamp;
  title: string;
  readingTime: string;
}
