import Image from 'next/image';
import Link from 'next/link';
import Tag from '../../components/Tag';
import {GetBlogPosts} from '../../lib/FirestoreOperations';
import {BlogPost, User} from '../../lib/types';
import {default as dayjs} from 'dayjs';
import {UserInfo} from '@firebase/auth-types';

export async function getServerSideProps(context) {
  const posts: BlogPost[] | any = await GetBlogPosts();
  return {
    props: {posts}, // will be passed to the page component as props
  };
}

interface extendedBlogPosts extends BlogPost {
  ['key']: string;
  id: string;
}
interface BlogPageProps {
  posts: extendedBlogPosts[];
  userProps: {user: UserInfo; userData: User};
}

export default function BlogPage(props: BlogPageProps) {
  console.log(props);

  return (
    <div className="relative bg-sky-100/30 px-4 pt-16 pb-20 sm:px-6 lg:px-8 lg:pt-24 lg:pb-28">
      <div className="absolute inset-0">
        <div className="h-1/3 sm:h-2/3" />
      </div>
      <div className="relative mx-auto max-w-7xl">
        <div className="text-center">
          <h2 className="text-3xl font-extrabold tracking-tight text-gray-900 sm:text-4xl">From the blog</h2>
          <p className="mx-auto mt-3 max-w-2xl text-xl text-gray-500 sm:mt-4">
            A collaborative space for me to share ideas and hear your opinion on them.
          </p>
        </div>
        <div className="mx-auto mt-12 grid max-w-lg gap-5 md:grid-cols-3 lg:max-w-none xl:grid-cols-4">
          {props.posts.map((post) => {
            const createdAt =
              typeof post?.createdAt === 'number' ? dayjs.unix(post.createdAt).format('MMM DD YYYY HH:mm') : 'Error';

            if (
              (post.status === 'draft' && props.userProps?.userData?.permissions?.admin) ||
              post.status === 'published'
            ) {
              return (
                <Link href={`/blog/${post.id}`} passHref key={post.title}>
                  <div
                    className="flex cursor-pointer flex-col overflow-hidden rounded-lg
                  shadow-lg "
                  >
                    <div className="flex-shrink-0">
                      {post.displayImage ? (
                        <Image
                          className="h-48 w-full object-cover"
                          src={post.displayImage}
                          height={'300%'}
                          width={'500%'}
                          alt="Blog Display Image"
                        />
                      ) : (
                        <Image
                          className="h-48 w-full object-cover"
                          src={`https://picsum.photos/seed/${Math.random() * 1000}/600`}
                          height={'300%'}
                          width={'500%'}
                          alt="Blog Display Image"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col justify-between bg-white/30 bg-clip-padding p-6 backdrop-blur-xl backdrop-filter">
                      <div className="flex-1">
                        <div className={'space-x-1'}>
                          {post.tags.map((tag, index) => {
                            return <Tag tag={tag} key={index} />;
                          })}
                        </div>

                        <div className="mt-2 block">
                          <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                          {post.status === 'draft' && (
                            <p className="text-xl font-bold uppercase text-rose-600">(draft)</p>
                          )}
                          <p className="mt-3 text-base text-gray-500">{post.summary}</p>
                        </div>
                      </div>
                      <div className="mt-6 flex items-center">
                        <div className="flex space-x-1 text-sm text-gray-500">
                          <time dateTime={createdAt.toString()}>{createdAt}</time>
                          <span aria-hidden="true">&middot;</span>
                          <span>{post.readingTime}</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              );
            }
          })}
        </div>
      </div>
    </div>
  );
}
