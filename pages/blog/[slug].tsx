import {convertFromRaw, EditorState} from 'draft-js';
import Metatags from '../../components/Metatags';
import EditorContent from '../../components/textEditor/EditorContent';
import {GetBlogPost, GetBlogPosts} from '../../lib/FirestoreOperations';
import {BlogPost, User} from '../../lib/types';
import {UserInfo} from '@firebase/auth-types';
import BlogComment from '../../components/BlogComment';

export async function getStaticProps({params}) {
  console.log(params);

  const {slug} = params;

  const post = await GetBlogPost(slug);

  const path = post?.id ?? 'not-found';

  return {
    props: {post, path},
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const posts = await GetBlogPosts();

  const paths = posts.map((post) => {
    const slug = post.id;
    return {
      params: {slug},
    };
  });

  return {
    // must be in this format:
    // paths: [
    //   { params: { slug }}
    // ],
    paths,
    fallback: 'blocking',
  };
}

interface BlogPostProps {
  path: string;
  post: BlogPost;
  userProps: {user: UserInfo; userData: User};
}

export default function BlogPostPage(props: BlogPostProps) {
  const contentState = convertFromRaw(JSON.parse(props.post.body));
  const editorState = EditorState.createWithContent(contentState);

  const comments = [
    {
      upVotes: 6,
      downVotes: 2,
      content: `This is a fantastic comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 20,
      downVotes: 2,
      content: `This is another fantastic comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 16,
      downVotes: 7,
      content: `This is not a very good comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 7,
      downVotes: 3,
      content: `This is another not a very good comment. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 26,
      downVotes: 7,
      content: `I believe it should be like x y z. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 16,
      downVotes: 7,
      content: `I believe it should instead be a b c. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 7,
      downVotes: 3,
      content: `My opinion is such and such. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
    {
      upVotes: 26,
      downVotes: 7,
      content: `I dont really have an opinion on this. Lorem ipsum dolor sit amet, consectetur adipiscing elit.
         Maecenas lectus nulla, tempor vel facilisis eu, facilisis sit amet enim.
          Nullam enim dui, dictum non laoreet at, cursus id diam.`,
    },
  ];
  return (
    <main>
      <Metatags
        title={props.post.title}
        description={props.post.summary}
        image={
          props.post.displayImage ??
          'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/profile-photo.jpg?alt=media&token=6d133b36-eb83-4bf3-a58d-317bc1eeaf2a'
        }
        currentURL={`rafaelzasas.com/blog/${props.path}`}
      />
      <div className="xl-px-8 relative mx-4 overflow-hidden py-10 font-roboto font-normal md:px-6 lg:px-6">
        <div className="flex flex-col space-y-4 divide-y divide-slate-900">
          <div className="m-0 mx-auto max-w-prose text-lg text-slate-800">
            <EditorContent editorState={editorState} />
          </div>
          {/* Comment Section */}
          <div className="mx-auto flex w-full max-w-none flex-col md:w-full lg:w-1/2">
            <div className="my-2 grid grid-cols-2">
              <p className="justify-self-start">Comments</p>
              <p className="mr-2 justify-self-end">Order by</p>
            </div>
            <div className="my-2 grid max-h-screen grid-cols-1 divide-y divide-stone-300 overflow-y-scroll md:max-h-60">
              {comments.map((comment, index) => {
                return (
                  <BlogComment
                    content={comment.content}
                    user={props.userProps.userData}
                    upVotes={comment.upVotes}
                    downVotes={comment.downVotes}
                    key={index}
                  />
                );
              })}
            </div>
            <p className="my-2 cursor-pointer text-blue-500 hover:text-blue-400">Add Comment</p>
          </div>
        </div>
      </div>
    </main>
  );
}
