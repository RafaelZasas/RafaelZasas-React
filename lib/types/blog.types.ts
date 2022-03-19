import {Timestamp} from '@firebase/firestore';

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
}

/**Replies to blog posts  */
interface BlogReply {
  author: Author;
  comment: string;
  timestamp: Timestamp;
  upvotes: UserVote[];
  downVote: UserVote[];
  replies?: BlogReply[];
}

interface UserVote {
  userId: string;
  timestamp: Timestamp;
}

export interface BlogPost {
  body: string;
  relatedLinks?: relatedLink[];
  replies?: BlogReply[];
  upvotes?: UserVote[];
  downVote?: UserVote[];
  status: 'archived' | 'draft' | 'published';
  summary: string;
  tags: blogTag[];
  timestamp: Timestamp;
  edited?: Timestamp;
  title: string;
}
