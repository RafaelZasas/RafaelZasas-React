import {convertFromRaw, EditorState} from 'draft-js';
import Metatags from '../../components/Metatags';
import EditorContent from '../../components/textEditor/EditorContent';
import {GetBlogPost, GetBlogPosts} from '../../lib/FirestoreOperations';
import {BlogPost, User} from '../../lib/types';
import {UserInfo} from '@firebase/auth-types';

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
      <div className="xl-px-8 relative mx-4 overflow-hidden py-10 md:px-6 lg:px-6">
        <div className="m-0 mx-auto max-w-prose font-roboto text-lg font-normal text-slate-800">
          <EditorContent editorState={editorState} />
        </div>
      </div>
    </main>
  );
}
