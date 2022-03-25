import {UserInfo} from '@firebase/auth-types';
import {UserData} from '../../lib/types';
import Error from 'next/error';
import {CheckCircleIcon, ChevronRightIcon, MailIcon} from '@heroicons/react/solid';
import Spinner1 from '../../components/loadingSpinners/Spinner1';
import {useEffect, useState} from 'react';
import {GetAllUsers} from '../../lib/FirestoreOperations';
import CustomImage from '../../components/Image';
import Link from 'next/link';
import {addPermissions} from '../../lib/firebase';

interface AllUsersPageProps {
  userProps: {user: UserInfo; userData: UserData};
}
export default function AllUsersPage(props: AllUsersPageProps) {
  return !props.userProps?.userData?.permissions?.admin ? (
    <Error statusCode={403} title={'Forbidden'} />
  ) : (
    <div className="mx-auto flex flex-col">
      <UsersList />
    </div>
  );
}

const MakeAdmin = (user: UserData) => {
  const newPermissions = {
    admin: true,
    level: user?.permissions?.admin ? 100 : user.permissions?.level ?? 0,
  };
  const payload = {
    uid: user.uid,
    email: user.email,
    newPermissions,
  };
  addPermissions(payload)
    .then((res: {data: any}) => {
      console.log(res.data);
    })
    .catch((error: any) => {
      console.dir(error);
    });
};

const UsersList = () => {
  const [isLoading, setLoading] = useState(true);
  const [users, setUsers] = useState<UserData[]>([]);

  useEffect(() => {
    GetAllUsers().then((users) => {
      setUsers(users);
      setLoading(false);
    });
  }, []);

  return isLoading ? (
    <Spinner1 />
  ) : (
    <div className="overflow-hidden bg-white shadow sm:rounded-md">
      <ul role="list" className="divide-y divide-gray-200">
        {users.map((user) => (
          <li key={user.uid}>
            <div className="block hover:bg-gray-50">
              <div className="flex items-center px-4 py-4 sm:px-6">
                <div className="flex min-w-0 flex-1 items-center">
                  <div className="flex-shrink-0">
                    <Link href={`users/${user.uid}`} passHref>
                      <div>
                        {user?.profilePhoto || user?.photoURL ? (
                          <CustomImage
                            src={user?.profilePhoto ?? user?.photoURL}
                            alt={user?.username}
                            width={80}
                            height={80}
                            className="pointer-events-none h-20 w-20 object-cover"
                          />
                        ) : (
                          <svg className="h-10 w-10 text-gray-300" fill="currentColor" viewBox="0 0 24 24">
                            <path d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z" />
                          </svg>
                        )}
                      </div>
                    </Link>
                  </div>
                  <div className="min-w-0 flex-1 px-4 md:grid md:grid-cols-2 md:gap-4">
                    <Link href={`users/${user.uid}`} passHref>
                      <div className="cursor-pointer">
                        <p className="truncate text-sm font-medium text-indigo-600">{user.username}</p>
                        <p className="mt-2 flex items-center text-sm text-gray-500">
                          <MailIcon className="mr-1.5 h-5 w-5 flex-shrink-0 text-gray-400" aria-hidden="true" />
                          <span className="truncate">{user.email}</span>
                        </p>
                      </div>
                    </Link>
                    <div className="hidden md:block">
                      <div>
                        <p className="cursor-pointer text-blue-400 hover:text-blue-500" onClick={() => MakeAdmin(user)}>
                          Make Admin
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};
