import dayjs from 'dayjs';
import Link from 'next/link';
import {UserData, BlogComment, BlogCommentReply} from '../../lib/types';
import CustomImage from '../Image';

const defaultAvatar = `https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/default-avatar.jpg?alt=media&token=da5befb3-193c-4a14-a17b-f036828dbf5b`;

const ReputationSection = (props: {user: Partial<UserData>}) => {
  let reputation = '';
  if (props.user?.permissions?.admin) {
    reputation = 'admin';
  } else {
    reputation = `${props.user?.permissions?.level || 0}`;
  }

  return <p className="mb-0 px-1 text-xs text-slate-500 dark:text-slate-300">Reputation: {reputation}</p>;
};

interface UserSectionProps {
  comment: BlogComment | BlogCommentReply;
  postId: string;
  user: UserData;
  primary?: boolean;
}

export default function UserSection(props: UserSectionProps) {
  const author: Partial<UserData> = props.comment.author;
  const comment: BlogCommentReply = props.comment as BlogCommentReply;
  const createdAtDate =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('MMM DD YYYY') : 'Error';
  const createdAtTime =
    typeof comment?.createdAt === 'number' ? dayjs.unix(comment.createdAt).format('HH:mm') : 'Error';

  return (
    <div
      className={`grid grid-cols-1 rounded-sm bg-clip-padding p-2  ${
        props.primary
          ? 'bg-blue-500/30  dark:bg-sky-400/30'
          : 'bg-blue-500/20 backdrop-blur-xl backdrop-filter dark:bg-sky-200/20'
      } `}
    >
      <p className="pb-1 text-xs text-slate-500 dark:text-slate-300">
        Replied {createdAtDate} at {createdAtTime}
      </p>
      <div className="justify-right flex flex-row">
        <CustomImage
          src={author?.profilePhoto || defaultAvatar}
          alt={author?.username ?? 'profile photo'}
          layout="fixed"
          width={40}
          height={40}
          className="pointer-events-none object-cover"
        />
        <div className="flex-1 flex-col">
          {/* Username Section */}
          <Link passHref href={`/users/${props.user?.uid}`}>
            <a className="my-0 cursor-pointer self-start px-1 pb-0 pt-0.5 text-sm text-blue-500 visited:text-purple-500 hover:text-blue-400">
              {author?.username ?? author?.email.split('@')[0]}
            </a>
          </Link>

          {/* Reputation Section */}
          <ReputationSection user={author} />
        </div>
      </div>
    </div>
  );
}
