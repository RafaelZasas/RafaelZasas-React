import Error from 'next/error';
import {useRouter} from 'next/router';
import GlassCard from '../../components/GlassCard';
import CustomImage from '../../components/Image';
import {GetUserData$} from '../../lib/dbOperations/users';

export default function UserProfilePage() {
  const router = useRouter();
  const uid = router.query.slug as string;
  const {user, loading, error} = GetUserData$(uid);
  console.log;

  const defaultProfilePhoto =
    'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/profilePhotos%2Fdefault-avatar.jpg?alt=media&token=f26406ac-4279-49f4-b6fe-385462e56923';

  if (error) {
    return <Error statusCode={parseInt(error?.code) || 500} title={'Unable to retrieve user profile'} />;
  }

  return (
    <div className="m-2 p-4">
      <GlassCard className="mx-auto rounded-lg md:w-1/2">
        <div className="p-2 text-slate-800 dark:text-slate-200">
          <div className={`flex flex-col space-x-4 ${loading && 'animate-pulse'} space-x-4`}>
            <div
              className={`m-2 mx-auto inline-block h-24 w-24 overflow-hidden rounded-full ${
                loading ? 'bg-slate-700' : 'bg-gray-100'
              }`}
            >
              {!loading && (
                <CustomImage
                  src={user?.profilePhoto || user?.photoURL || defaultProfilePhoto}
                  alt={'Profile Photo'}
                  layout={'responsive'}
                  objectFit={'cover'}
                  width={24}
                  height={24}
                />
              )}
            </div>

            <div className="my-4 flex flex-col space-y-4 md:flex-row md:space-y-0 md:space-x-2">
              {loading || !user ? (
                <div className="flex-1 flex-col space-y-3 ">
                  <p className={`h-2 w-1/6 rounded bg-slate-700`}></p>
                  <p className={`h-2 w-1/3 rounded bg-slate-700`} />
                  <p className={`h-2 w-1/6 rounded bg-slate-700`} />
                  <p className={`h-2 w-1/6 rounded bg-slate-700`} />
                </div>
              ) : (
                <div className="h-fit flex-1 flex-col space-y-3 overflow-x-auto font-semibold">
                  <p>{user?.username} </p>
                  <p>{user?.email}</p>
                  {user?.website && (
                    <p>
                      <a
                        href={'https://' + user.website}
                        target="_blank"
                        rel="noreferrer"
                        className={'text-blue-500 hover:text-blue-600'}
                      >
                        https://{user.website}
                      </a>
                    </p>
                  )}
                  <p>
                    {user?.permissions.admin
                      ? 'Permission Level: Admin'
                      : `Permission Level: ${user?.permissions?.level || 0}`}
                  </p>
                </div>
              )}

              <div className="flex-1 flex-col items-stretch justify-items-start">
                {loading || !user ? (
                  <p className="h-full bg-slate-700"></p>
                ) : (
                  <span>{user.bio || 'User has not set a bio'}</span>
                )}
              </div>
            </div>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
