import {UserData} from '../lib/types';
import Link from 'next/link';
import CustomImage from './Image';

const UpVoteIcon = () => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="currentColor">
      <path
        d="M9.39 265.4l127.1-128C143.6 131.1 151.8 128 160 128s16.38 3.125 22.63 9.375l127.1 128c9.156
            9.156 11.9 22.91 6.943 34.88S300.9 320 287.1 320H32.01c-12.94 0-24.62-7.781-29.58-19.75S.2333
            274.5 9.39 265.4z"
      />
    </svg>
  );
};

const DownVoteIcon = () => {
  return (
    <div className="mx-auto flex items-center justify-center text-center text-blue-500">
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 320 512" width="24" height="24" fill="currentColor">
        <path
          d="M310.6 246.6l-127.1 128C176.4 380.9 168.2 384 160 384s-16.38-3.125-22.63-9.375l-127.1-128C.2244
             237.5-2.516 223.7 2.438 211.8S19.07 192 32 192h255.1c12.94 0 24.62 7.781 29.58 19.75S319.8 237.5 310.6 246.6z"
        />
      </svg>
    </div>
  );
};

interface VoteSectionProps {
  numVotes: number;
}

const VoteSection = (props: VoteSectionProps) => {
  return (
    <div className="flex w-10 flex-col items-center justify-start">
      <UpVoteIcon />
      <div>{props.numVotes}</div>
      <DownVoteIcon />
    </div>
  );
};

const ReputationSection = (props: {user: UserData}) => {
  let reputation = '';
  if (props.user?.permissions?.admin) {
    reputation = 'admin';
  } else {
    reputation = `${props.user?.permissions?.level}` ?? '0';
  }

  return <p className="my-0 px-1 text-xs text-slate-500">Reputation: {reputation}</p>;
};

const UserSection = (props: {user: UserData}) => {
  return (
    <div className="grid grid-cols-1">
      <p className="text-xs text-slate-500">Replied Mar 22 2021 at 14:23</p>
      <div className="flex flex-row">
        <div className="justify-right">
          {props.user?.profilePhoto || props.user?.photoURL ? (
            <CustomImage
              src={props.user?.profilePhoto ?? props.user?.photoURL}
              alt={props.user?.username}
              width={40}
              height={40}
              className="pointer-events-none object-cover"
            />
          ) : (
            <svg className="h-20 w-20 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
              <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
            </svg>
          )}
        </div>
        <div className="flex flex-col">
          {/* Username Section */}
          <Link passHref href={`/users/${props.user?.uid}`}>
            <a className="my-0 cursor-pointer self-start px-1 pb-0 pt-0.5 text-sm text-blue-500 visited:text-purple-500 hover:text-blue-400">
              {props.user?.username ?? 'Username'}
            </a>
          </Link>

          {/* Reputation Section */}
          <ReputationSection user={props.user} />
        </div>
      </div>
    </div>
  );
};

interface BlogCommentProps {
  upVotes: number;
  downVotes: number;
  content: string;
  user: UserData;
}

export default function BlogComment(props: BlogCommentProps) {
  return (
    <div className="flex flex-col space-y-3 py-2 md:space-y-4">
      <div className="flex flex-row space-x-2 ">
        <VoteSection numVotes={props.upVotes - props.downVotes} />
        <p className="text-left">{props.content}</p>
      </div>
      <div className="grid max-h-16 grid-cols-2">
        <div className="mx-2 flex flex-row items-start justify-start space-x-2 text-base text-slate-500">
          <p className="cursor-pointer">reply</p>
          <p className="cursor-pointer">edit</p>
          <p className="cursor-pointer">flag</p>
        </div>
        <div className="mx-2 justify-self-end">
          <UserSection user={props.user} />
        </div>
      </div>
    </div>
  );
}