import Image from 'next/image';
import Link from 'next/link';
import Tag from '../../components/Tag';
import {deleteBlogPost, GetBlogPosts, updateBlogPost} from '../../lib/FirestoreOperations';
import {BlogPost, UserData} from '../../lib/types';
import {default as dayjs} from 'dayjs';
import {UserInfo} from '@firebase/auth-types';
import Metatags from '../../components/Metatags';
import CustomImage from '../../components/Image';
import {ArchiveIcon, EditIcon, TrashCanIcon, UnarchiveIcon, UploadIcon} from '../../public/svg-icons';
import Modal from '../../components/Modal';
import {useContext, useState} from 'react';
import {ToastContext} from '../../lib/context';

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
  userProps: {user: UserInfo; userData: UserData};
}

export default function BlogPage(props: BlogPageProps) {
  const [openConfirmationModal, setOpenConfirmationModal] = useState(false);
  const [confirmationModalBody, setConfirmationModalBody] = useState<string>('');
  const [confirmationModalHeading, setConfirmationModalHeading] = useState<string>('');
  const [confirmationModalFunction, setConfirmationModalFunction] = useState<Function>();
  const {setShowToast, setToastData} = useContext(ToastContext);

  return (
    <main>
      <Metatags title="Blog" description="Browse my latest blog posts!" currentURL="rafaelzasas.com/blog" />
      <Modal
        open={openConfirmationModal}
        setOpen={setOpenConfirmationModal}
        header={confirmationModalHeading}
        confirmFunction={confirmationModalFunction}
        body={confirmationModalBody}
      />
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
          <div className="mx-auto mt-12 grid max-w-lg grid-cols-1 gap-5 md:max-w-none md:grid-cols-2 lg:max-w-none lg:grid-cols-3 xl:grid-cols-4">
            {props.posts.map((post) => {
              const createdAtDate =
                typeof post?.createdAt === 'number' ? dayjs.unix(post.createdAt).format('MMM DD YYYY') : 'Error';
              const createdAtTime =
                typeof post?.createdAt === 'number' ? dayjs.unix(post.createdAt).format('HH:mm') : 'Error';

              const UnarchivePost = () => {
                try {
                  updateBlogPost({...post, status: 'draft'});
                  setToastData({
                    type: 'success',
                    body: `${post.title} was unarchived`,
                    heading: 'Success',
                  });
                  setShowToast(true);
                } catch (error) {
                  setToastData({
                    type: 'error',
                    body: error.message,
                    heading: 'Error',
                  });
                  setShowToast(true);
                }
              };

              const ArchivePost = () => {
                const Archive = () => {
                  try {
                    updateBlogPost({
                      ...post,
                      status: 'archived',
                    });
                    setToastData({
                      type: 'success',
                      body: `${post.title} was archived`,
                      heading: 'Success',
                    });
                    setShowToast(true);
                  } catch (error) {
                    setToastData({
                      type: 'error',
                      body: error.message,
                      heading: 'Error',
                    });
                    setShowToast(true);
                  }
                };
                setConfirmationModalFunction(() => Archive);
                setConfirmationModalHeading('Archive Post');
                setConfirmationModalBody(`Are you sure you want to archive ${post.title}`);
                setOpenConfirmationModal(true);
              };

              const DeletePost = () => {
                const Delete = () => {
                  try {
                    deleteBlogPost(post.id);
                    setToastData({
                      type: 'success',
                      body: `${post.title} was archived`,
                      heading: 'Success',
                    });
                    setShowToast(true);
                  } catch (error) {
                    setToastData({
                      type: 'error',
                      body: error.message,
                      heading: 'Error',
                    });
                    setShowToast(true);
                  }
                };

                setConfirmationModalFunction(() => Delete);
                setConfirmationModalHeading('Delete Post');
                setConfirmationModalBody(`Are you sure you want to delete ${post.title}`);
                setOpenConfirmationModal(true);
              };

              const PublishPost = () => {
                const Delete = () => {
                  try {
                    updateBlogPost({...post, status: 'published'});
                    setToastData({
                      type: 'success',
                      body: `${post.title} was publshed`,
                      heading: 'Success',
                    });
                    setShowToast(true);
                  } catch (error) {
                    setToastData({
                      type: 'error',
                      body: error.message,
                      heading: 'Error',
                    });
                    setShowToast(true);
                  }
                };

                setConfirmationModalFunction(() => Delete);
                setConfirmationModalHeading('Publish Post');
                setConfirmationModalBody(`Are you sure you want to publish ${post.title}`);
                setOpenConfirmationModal(true);
              };

              if (
                ((post.status === 'draft' || post.status === 'archived') &&
                  props.userProps?.userData?.permissions?.admin) ||
                post.status === 'published'
              ) {
                return (
                  <div className="flex cursor-pointer flex-col overflow-hidden rounded-lg shadow-lg" key={post.id}>
                    <Link href={`/blog/${post.id}`} passHref>
                      <>
                        <div className="flex-shrink-0">
                          {post.displayImage ? (
                            <CustomImage
                              className="h-48 w-full object-cover"
                              src={post.displayImage}
                              height={'300%'}
                              width={'500%'}
                              layout={'responsive'}
                              objectFit={'cover'}
                              priority={true}
                              alt="Blog Display Image"
                            />
                          ) : (
                            <CustomImage
                              className="h-48 w-full object-cover"
                              src={`https://picsum.photos/seed/${Math.random() * 1000}/600`}
                              height={'300%'}
                              width={'500%'}
                              layout={'responsive'}
                              objectFit={'cover'}
                              alt="Blog Display Image"
                            />
                          )}
                        </div>
                        <div className="flex flex-1 flex-col justify-between bg-white/30 bg-clip-padding p-6 backdrop-blur-xl backdrop-filter">
                          <div className="flex-1">
                            <div className={'space-x-1 space-y-1'}>
                              {post.tags.map((tag, index) => {
                                return <Tag tag={tag} key={index} />;
                              })}
                            </div>

                            <div className="mt-2 block">
                              <p className="text-xl font-semibold text-gray-900">{post.title}</p>
                              <p className="mt-3 text-base text-gray-500">{post.summary}</p>
                            </div>
                          </div>
                          <div className="mt-6 flex items-center">
                            <div className="flex space-x-1 text-sm text-gray-500">
                              <time dateTime={createdAtDate.toString()}>
                                {createdAtDate} at {createdAtTime}
                              </time>
                              <span aria-hidden="true">&middot;</span>
                              <span>{post.readingTime}</span>
                            </div>
                          </div>
                          {props.userProps.userData?.permissions?.admin && (
                            <div className="mt-4 flex flex-row items-center justify-between">
                              {post.status === 'archived' && (
                                <>
                                  <Tag tag={{color: 'bg-rose-500', name: 'Archived'}} />
                                  <TrashCanIcon
                                    className="h-6 w-6 fill-red-500 text-center hover:fill-red-600"
                                    function={DeletePost}
                                  />
                                  <UnarchiveIcon
                                    className="h-7 w-7 fill-orange-500 text-center hover:fill-orange-600"
                                    function={UnarchivePost}
                                  />
                                </>
                              )}
                              {post.status === 'draft' && (
                                <>
                                  <Tag tag={{color: 'bg-amber-500', name: 'Draft'}} />
                                  <ArchiveIcon
                                    className="h-6 w-6 fill-orange-500 hover:fill-orange-600"
                                    function={ArchivePost}
                                  />
                                  <UploadIcon
                                    className="h-6 w-6 fill-green-500 hover:fill-green-700"
                                    function={PublishPost}
                                  />
                                </>
                              )}
                              {post.status === 'published' && (
                                <>
                                  <Tag tag={{color: 'bg-emerald-500', name: 'Published'}} />
                                  <ArchiveIcon
                                    className="h-6 w-6 fill-orange-500 hover:fill-orange-600"
                                    function={ArchivePost}
                                  />
                                </>
                              )}
                              <EditIcon className="h-6 w-6 fill-blue-500 hover:fill-blue-600" />
                            </div>
                          )}
                        </div>
                      </>
                    </Link>
                  </div>
                );
              }
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
