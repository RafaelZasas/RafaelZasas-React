import {UploadMetadata} from 'firebase/storage';
import {ChangeEvent, FormEvent, useContext, useState} from 'react';
import Button from '../components/Button';
import FileInputButton from '../components/FileInputButton';
import CustomImage from '../components/Image';
import Spinner1 from '../components/loadingSpinners/Spinner1';
import Metatags from '../components/Metatags';
import {uploadImage} from '../lib/CloudStorageOperations';
import {FileData} from '../lib/types';
import {default as dayjs} from 'dayjs';
import {UserContext} from '../lib/context';

interface BugReport {
  title: string;
  description: string;
  platform: string | null;
  browser: string;
  image: string;
  timestamp: string;
  userEmail: string;
}

export default function Bugs() {
  return (
    <main>
      <Metatags
        title="Bug Reporting"
        description="Report nasty bugs that are in need of extermination"
        currentURL="rafaelzasas.com/bugs"
      />
      <div className="flex flex-col items-center p-2">
        <div className="space-y-2 py-2 text-center">
          <h1 className="text-2xl text-slate-800 dark:text-slate-200">Bugs are nasty</h1>
          <h2 className="text-xl text-slate-700 dark:text-slate-300">Good thing you and I can find and squash them</h2>
        </div>
        <BugReportForm />
      </div>
    </main>
  );
}

const BugReportForm = () => {
  const [imageIsLoading, setImageLoading] = useState(false);
  const [imageData, setImageData] = useState<FileData>(undefined);
  const {userData} = useContext(UserContext);

  function Upload(imageData: FileData) {
    const metadata: UploadMetadata = {
      cacheControl: 'public,max-age=8200',
      contentType: `image/${imageData.type}`,
      customMetadata: {
        username: userData.username,
        email: userData.email,
      },
    };
    uploadImage(
      `bugReports/${imageData.name.split('.')[0]}_${dayjs(new Date()).format('DDMMYYYYTHH:mm:ss')}.${imageData.type}`,
      imageData.src,
      metadata
    ).then((imageUrl) => {
      setImageData({...imageData, src: imageUrl});
      setImageLoading(false);
    });
  }

  function submitBugReport(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const formData: BugReport = {
      // @ts-ignore
      title: event.target.title.value,
      description: event.currentTarget.description.value,
      platform: typeof window !== 'undefined' ? navigator.platform : null,
      browser: getUserBrowser(),
      image: imageData?.src || null,
      timestamp: dayjs(new Date()).format('DD/MM/YYYY HH:mm:ss'),
      userEmail: userData.email,
    };
    sendTicketToClickUp(formData);
  }

  return (
    <form onSubmit={submitBugReport} className="flex w-full flex-col items-center justify-center py-2 ">
      <div className="m-2 mx-auto flex w-full flex-col space-y-4 p-2 md:w-1/3 md:p-0">
        <span>
          <label htmlFor="title" className="text-sm font-medium text-slate-700 dark:text-slate-200 sm:mt-px sm:pt-2">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={60}
            required
            className="block w-full rounded-md border-2 border-gray-300 bg-slate-300 p-2 shadow-sm focus:border-indigo-500 dark:border-black dark:bg-black/50 dark:text-slate-100 dark:focus:border-blue-400 sm:text-sm"
            defaultValue={''}
          />
          <p className="mt-2 block text-sm text-slate-700 dark:text-slate-300">Short description.</p>
        </span>
        <span>
          <label
            htmlFor="description"
            className="text-sm font-medium text-slate-700 dark:text-slate-200 sm:mt-px sm:pt-2"
          >
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows={3}
            required
            className="block w-full rounded-md border-2 border-gray-300 bg-slate-300 p-2 shadow-sm focus:border-indigo-500 dark:border-black dark:bg-black/50 dark:text-slate-100 dark:focus:border-blue-400 sm:text-sm"
            defaultValue={''}
          />
          <p className="mt-2 block text-sm text-slate-700 dark:text-slate-300">
            Please provide a detailed description of the issue.
          </p>
        </span>

        <span className="flex flex-col space-y-4">
          <span>
            <FileInputButton
              type="button"
              text={'Upload'}
              buttonStyle="basic"
              id={'bugImageInput'}
              name={'bugImageInput'}
              maxFileSizeInKB={1000}
              onUpload={(value: FileData) => Upload(value)}
              allowedExtensions={['jpeg', 'jpeg', 'png']}
              setLoading={setImageLoading}
            />
          </span>

          {imageIsLoading && !imageData?.src && <Spinner1 />}

          {imageData?.src && !imageIsLoading && (
            <span className="h-full w-full bg-none">
              <CustomImage
                src={imageData.src}
                alt={'bugReportImage'}
                layout={'fixed'}
                objectFit={'scale-down'}
                width={'100%'}
                height={'100%'}
              />
            </span>
          )}

          {!imageData?.src && (
            <p className="mt-2 block text-sm text-slate-700 dark:text-slate-300">
              Please provide a screenshot of the issue if possible.
            </p>
          )}
        </span>

        <span>
          <Button type="submit" text="Submit" />
        </span>
      </div>
    </form>
  );
};

function getUserBrowser() {
  if (typeof window !== 'undefined') {
    if ((navigator.userAgent.indexOf('Opera') || navigator.userAgent.indexOf('OPR')) != -1) {
      return 'Opera';
    } else if (navigator.userAgent.indexOf('Edg') != -1) {
      return 'Edge';
    } else if (navigator.userAgent.indexOf('Chrome') != -1) {
      return 'Chrome';
    } else if (navigator.userAgent.indexOf('Safari') != -1) {
      return 'Safari';
    } else if (navigator.userAgent.indexOf('Firefox') != -1) {
      return 'Firefox';
    } else if (navigator.userAgent.indexOf('MSIE') != -1) {
      //IF IE > 10
      return 'Internet Explorer';
    } else {
      return 'Unknown';
    }
  } else {
    return null;
  }
}

function sendTicketToClickUp(payload: BugReport) {
  const request = new XMLHttpRequest();

  request.open('POST', 'https://api.clickup.com/api/v2/list/126192634/task');

  request.setRequestHeader('Authorization', 'pk_12753582_BAGQJFHNHBLT7GI3DMPVU19LKR9HA3C9');
  request.setRequestHeader('Content-Type', 'application/json');

  request.onreadystatechange = function () {
    if (this.readyState === 4) {
      console.log('Status:', this.status);
      console.log('Headers:', this.getAllResponseHeaders());
      console.log('Body:', this.responseText);
    }
  };

  const ticketDescription = `
  <p>Created by: ${payload.userEmail}</p>
  <p>Desription:</p>
  <p>${payload.description}</p>
  <p>Browser: ${payload.browser}</p>
  <p>Platform: ${payload.platform}</p>
  <p>Timestamp: ${payload.timestamp}</p>
  <br>
  <img width="100%" alt="nasty_bug" src="${payload.image}">
  `;

  const body = {
    name: payload.title,
    markdown_description: ticketDescription,
    tags: ['🐛 bug-fix'],
    status: 'Open',
    priority: 3,
    notify_all: true,
    parent: null,
    links_to: null,
    check_required_custom_fields: false,
  };

  request.send(JSON.stringify(body));
}
