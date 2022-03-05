import { Timestamp } from "@firebase/firestore-types";

// Blog related interfaces

// paragraph item which builds the main body of the blog post
interface paragraph {
  h1?: string;
  h2?: string;
  h3?: string;
  body: string;
}

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
  body: paragraph[];
  tags: blogTag[];
  relatedLinks: relatedLink[];
  timestamp: Timestamp;
  replies?: BlogReply[];
}
