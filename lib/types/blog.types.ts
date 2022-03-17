import {Timestamp} from '@firebase/firestore-types';

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
  replies?: BlogReply[];
}

export interface Blog {
  title: string;
  summary: string;
  body: string;
  tags: blogTag[];
  relatedLinks: relatedLink[];
  timestamp: Timestamp;
  replies?: BlogReply[];
}
