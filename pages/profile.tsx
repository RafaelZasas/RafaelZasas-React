import {useContext} from "react";
import {UserContext} from "../lib/context";
import {ExclamationCircleIcon} from '@heroicons/react/solid'
import Image from "next/image";

export default function ProfilePage({}) {

    const {user, userData} = useContext(UserContext);

    return (
        <div className="space-y-6 px-5 py-4">

            {/* Personal Info Section */}
            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">

                {/* Heading */}
                <div className="w-full pb-5">
                    <h3 className="text-lg font-medium leading-6 text-gray-900">Profile</h3>
                    <p className="mt-1 text-sm text-gray-500">
                        This information will be displayed on the feedback section and your public profile.
                    </p>
                </div>

                {/* Form Input */}
                <div className="w-full md:gap-6 mt-2">
                    <div className="mt-5 md:mt-0">
                        <form className="space-y-6" action="#" method="POST">

                            {/* Username Input */}
                            <div className='grid grid-cols-4 '>
                                <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-700">
                                        Username
                                    </label>
                                    <div className="mt-1 relative rounded-md shadow-sm ">
                                        <input
                                            type="text"
                                            name="username"
                                            id="username"
                                            className="block w-full pr-10 border-red-300 text-red-900 placeholder-red-300 focus:outline-none focus:ring-red-500 focus:border-red-500 sm:text-sm rounded-md"
                                            placeholder={userData?.username ? userData?.username : 'username'}
                                            defaultValue={userData?.username ? userData?.username : 'username'}
                                            aria-invalid="false"
                                            aria-describedby="username-error"
                                        />
                                        <div
                                            className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                                            <ExclamationCircleIcon className="h-5 w-5 text-red-500" aria-hidden="true"/>
                                        </div>
                                    </div>
                                    <p className="mt-2 text-sm text-red-600" id="username-error">
                                        Username is taken. Please choose another
                                    </p>
                                </div>
                            </div>

                            {/* Website Input */}
                            <div className="grid grid-cols-4 gap-6">
                                <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <label htmlFor="company-website"
                                           className="block text-sm font-medium text-gray-700">
                                        Website
                                    </label>
                                    <div className="mt-1 flex rounded-md shadow-sm">
                                        <span
                                            className="inline-flex items-center px-3 rounded-l-md border
                                             border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                https://
                                            </span>
                                        <input
                                            type="text"
                                            name="company-website"
                                            id="company-website"
                                            className="focus:ring-indigo-500 focus:border-indigo-500 flex-1
                                            block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                            placeholder="www.example.com"
                                        />
                                    </div>
                                </div>
                            </div>

                            {/* Bio Input */}
                            <div className="grid grid-cols-4 gap-6">
                                <div className="col-span-full sm:col-span-full md:col-span-2 lg:col-span-2 xl:col-span-2">
                                    <label htmlFor="about" className="block text-sm font-medium text-gray-700">
                                        About
                                    </label>
                                    <div className="mt-1">
                                    <textarea
                                        id="about"
                                        name="about"
                                        rows={3}
                                        className="p-2 shadow-sm focus:ring-indigo-500 focus:border-indigo-500 block
                                         w-full sm:text-sm border border-gray-300 rounded-md"
                                        placeholder="eg. Hi, my name Jeff"
                                        defaultValue={userData?.bio? userData.bio: ''}
                                    />
                                    </div>
                                    <p className="mt-2 text-sm text-gray-500">Brief description for your profile. URLs
                                        are
                                        hyperlinked.</p>
                                </div>
                            </div>

                            <div>
                                <label className="block text-sm font-medium text-gray-700">Photo</label>
                                <div className="mt-1 flex items-center space-x-5">
                  <span className="inline-block h-12 w-12 rounded-full overflow-hidden bg-gray-100">
                      {!userData?.profilePhoto && (
                      <svg className="h-full w-full text-gray-300" fill="currentColor"
                           viewBox="0 0 24 24">
                          <path
                              d="M24 20.993V24H0v-2.996A14.977 14.977 0 0112.004 15c4.904 0 9.26 2.354 11.996 5.993zM16.002 8.999a4 4 0 11-8 0 4 4 0 018 0z"/>
                      </svg> )
                      }

                      {userData?.profilePhoto && (
                      <Image className="h-full w-full text-gray-300"
                             src={userData.profilePhoto} width={96} height={96}/> )
                      }
                  </span>
                                    <button
                                        type="button"
                                        className="bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm leading-4 font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                                    >
                                        Change
                                    </button>
                                </div>
                            </div>

                        </form>
                    </div>
                </div>
            </div>

            <div className="bg-white shadow px-4 py-5 sm:rounded-lg sm:p-6">
                <div className="md:grid md:grid-cols-3 md:gap-6">
                    <div className="md:col-span-1">
                        <h3 className="text-lg font-medium leading-6 text-gray-900">Notifications</h3>
                        <p className="mt-1 text-sm text-gray-500">Decide which communications you&apos;d like to receive
                            and how.</p>
                    </div>
                    <div className="mt-5 md:mt-0 md:col-span-2">
                        <form className="space-y-6" action="#" method="POST">
                            <fieldset>
                                <legend className="text-base font-medium text-gray-900">By Email</legend>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-start">
                                        <div className="h-5 flex items-center">
                                            <input
                                                id="comments"
                                                name="comments"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="comments" className="font-medium text-gray-700">
                                                Comments
                                            </label>
                                            <p className="text-gray-500">Get notified when someones posts a comment on a
                                                posting.</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="candidates"
                                                name="candidates"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="candidates" className="font-medium text-gray-700">
                                                Projects
                                            </label>
                                            <p className="text-gray-500">Get notified by projects (eg. spaceX updater)</p>
                                        </div>
                                    </div>
                                    <div className="flex items-start">
                                        <div className="flex items-center h-5">
                                            <input
                                                id="offers"
                                                name="offers"
                                                type="checkbox"
                                                className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 rounded"
                                            />
                                        </div>
                                        <div className="ml-3 text-sm">
                                            <label htmlFor="offers" className="font-medium text-gray-700">
                                                Updates
                                            </label>
                                            <p className="text-gray-500">Get notified when a new project is ready for testing</p>
                                        </div>
                                    </div>
                                </div>
                            </fieldset>
                            <fieldset>
                                <div>
                                    <legend className="text-base font-medium text-gray-900">Push Notifications</legend>
                                    <p className="text-sm text-gray-500">These are delivered as banner notifications to
                                        your mobile or desktop.</p>
                                </div>
                                <div className="mt-4 space-y-4">
                                    <div className="flex items-center">
                                        <input
                                            id="push-everything"
                                            name="push-notifications"
                                            type="radio"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label htmlFor="push-everything"
                                               className="ml-3 block text-sm font-medium text-gray-700">
                                            Everything
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="push-email"
                                            name="push-notifications"
                                            type="radio"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label htmlFor="push-email"
                                               className="ml-3 block text-sm font-medium text-gray-700">
                                            Same as email
                                        </label>
                                    </div>
                                    <div className="flex items-center">
                                        <input
                                            id="push-nothing"
                                            name="push-notifications"
                                            type="radio"
                                            className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300"
                                        />
                                        <label htmlFor="push-nothing"
                                               className="ml-3 block text-sm font-medium text-gray-700">
                                            No push notifications
                                        </label>
                                    </div>
                                </div>
                            </fieldset>
                        </form>
                    </div>
                </div>
            </div>

            <div className="flex justify-end">
                <button
                    type="button"
                    className="bg-white py-2 px-4 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    className="ml-3 inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                >
                    Save
                </button>
            </div>
        </div>

    )
}

