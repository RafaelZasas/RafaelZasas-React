import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import GlassCard from '../components/GlassCard';
import CustomImage from '../components/Image';
import Metatags from '../components/Metatags';
import {GithubIcon, InstagramIcon, LinkedInIcon, StackOverflowIcon, TwitterIcon} from '../public/svg-icons';

export default function AboutPage({}) {
  const Header = () => {
    return (
      <div className="mx-auto mb-2 max-w-2xl px-4 pt-16 text-center sm:px-6 sm:pt-8 lg:px-8">
        <h1 className="text-3xl sm:text-4xl">
          <span className="block">Hello, folks!</span>
        </h1>

        <CustomImage
          className="mt-2 inline-block align-middle"
          src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif"
          width="30px"
          layout="fixed"
          height={'30px'}
          alt={'wave'}
        />

        <div className="mt-3  flex-auto justify-center text-2xl">
          <p className="mb-2 whitespace-normal">Welcome to the React version of my Website</p>
          <CustomImage
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
            className="mt-2 inline-block h-8 p-2 align-middle sm:h-8 md:h-10 lg:h-14"
            width={45}
            layout="fixed"
            height={40}
            alt={'reactIcon'}
          />
        </div>
      </div>
    );
  };

  const StatusBadges = () => {
    const stats = [
      {
        url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/build-test.yml',
        src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/build-test.yml/badge.svg',
        alt: 'built-test',
      },
      {
        url: 'https://github.com/RafaelZasas/rafaelzasas-react/deployments?environment=Preview',
        src: 'https://img.shields.io/github/deployments/RafaelZasas/rafaelzasas-react/preview?label=Preview&logo=vercel',
        alt: 'Preview',
      },
      {
        url: 'https://github.com/RafaelZasas/rafaelzasas-react/deployments?environment=Production',
        src: 'https://img.shields.io/github/deployments/RafaelZasas/rafaelzasas-react/production?label=Production&logo=vercel',
        alt: 'Live Deploy',
      },
    ];

    return (
      <div className={'mt-6 flex flex-col'}>
        <h3 className={'text-center text-xl'}>🚀 Build and Deployment Status</h3>

        <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-3">
          {stats.map((item, index) => (
            <li key={index} className="overflow-hidden px-4 py-1 sm:p-0">
              <a href={item.url}>
                <img src={item.src} alt={item.alt} width={150} height={50} />
              </a>
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const ProjectStats = () => {
    const stats = [
      {
        url: 'https://img.shields.io/tokei/lines/github/RafaelZasas/RafaelZasas-React',
        alt: 'lines of code',
        width: 100,
        height: 50,
      },
      {
        url: 'https://img.shields.io/github/contributors/RafaelZasas/RafaelZasas-React',
        alt: 'Contributors',
        width: 100,
        height: 50,
      },
      {
        url: 'https://img.shields.io/github/issues/RafaelZasas/RafaelZasas-React',
        alt: 'issues',
        width: 100,
        height: 50,
      },
      {
        url: 'https://img.shields.io/github/issues-pr/RafaelZasas/RafaelZasas-React',
        alt: 'Pull Requests',
        width: 150,
        height: 100,
      },
    ];

    return (
      <div className={'mt-6 flex flex-col'}>
        <h3 className={'text-center text-xl'}>📈 Project Stats</h3>
        <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-4">
          {stats.map((item, index) => (
            <li key={index} className="overflow-hidden px-4 py-1 sm:p-3">
              <img src={item.url} alt={item.alt} width={item?.width ?? 100} height={item?.height ?? 50} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const About = () => {
    return (
      <GlassCard
        className="py-5sm:p-6 mx-5 mb-3 overflow-hidden rounded-lg
                 px-4"
      >
        <div className="mx-auto max-w-2xl px-4 pt-2 text-center font-sans font-bold sm:px-3 sm:pt-3 sm:text-lg lg:px-5 lg:text-lg">
          <p>
            I made this site to learn about React and NextJs but also to give people the opportunity to see a live
            example of the pros and cons of each framework. It also allows me to show my proficiency in React for any
            potential job recruiters.
          </p>
          <br />
          <p>
            This site was built using React and NextJs, is styled using Tailwind CSS and is hosted on Vercel with
            backend operations done through Firebase.
          </p>
          <br />
          <p>
            The codebase for this site can be viewed{' '}
            <a className="text-blue-500 underline" href="https://github.com/rafaelzasas/RafaelZasas-React">
              Here
            </a>
            .
          </p>
          <p>
            There is also a Angular version of my website which can be viewed{' '}
            <a className="text-blue-500 underline" href="https://rafaelzasas.com">
              Here
            </a>
            .
          </p>
        </div>
      </GlassCard>
    );
  };

  const RepoStats = () => {
    const stats = [
      {
        src: 'https://img.shields.io/github/watchers/RafaelZasas/RafaelZasas-React?style=social',
        alt: 'Watchers',
        width: 125,
      },
      {
        src: 'https://img.shields.io/github/stars/rafaelzasas/RafaelZasas-React?style=social',
        alt: 'Stars',
      },
      {
        src: 'https://img.shields.io/github/forks/rafaelzasas/RafaelZasas-React?style=social',
        alt: 'Forks',
      },
    ];

    return (
      <GlassCard
        className="mx-5 mb-3 overflow-hidden rounded-lg px-4
                 py-5 shadow-lg sm:p-6"
      >
        <div className={'mt-6 flex flex-col justify-center'}>
          <div className={'flex justify-center'}>
            <FontAwesomeIcon icon={faGithub} className={'mr-1 mt-1.5 inline-block h-full'} />
            <h3 className={'text-xl '}>Repo Stats</h3>
          </div>

          <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-3">
            {stats.map((item, index) => (
              <li key={index} className="overflow-hidden px-4 py-1 sm:p-0">
                <img src={item.src} alt={item.alt} width={item?.width ?? 100} height={50} />
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    );
  };

  const Social = () => {
    const stats = [
      {
        icon: (
          <InstagramIcon className="h-10 w-10 fill-slate-600 stroke-slate-500 hover:fill-slate-800 dark:fill-slate-300 dark:hover:fill-slate-500" />
        ),
        url: 'https://instagram.com/rafaelzasas',
        alt: 'Instagram',
      },
      {
        icon: <TwitterIcon className="h-10 w-10 fill-sky-500 stroke-slate-500 hover:fill-sky-600" />,
        src: 'https://image.flaticon.com/icons/png/512/733/733579.png',
        url: 'https://twitter.com/rafaelzasas',
        alt: 'Twitter',
      },
      {
        icon: <LinkedInIcon className="h-10 w-10 fill-sky-600 stroke-slate-500 hover:fill-sky-700" />,
        src: 'https://image.flaticon.com/icons/png/512/174/174857.png',
        url: 'https://linkedin.com/in/rafael-zasas',
        alt: 'LinkedIn',
      },
      {
        icon: (
          <GithubIcon className="h-10 w-10 fill-slate-600 stroke-slate-500 hover:fill-slate-800 dark:fill-slate-300 dark:fill-slate-300 dark:hover:fill-slate-500" />
        ),
        src: 'https://image.flaticon.com/icons/png/512/174/174857.png',
        url: 'https://linkedin.com/in/rafael-zasas',
        alt: 'LinkedIn',
      },
    ];

    return (
      <GlassCard
        className="mx-5 mb-3 overflow-hidden rounded-lg px-4
                 py-5 bg-blend-multiply sm:p-6"
      >
        <div className={'mt-6 flex flex-col justify-center'}>
          <div className={'mb-2 flex justify-center'}>
            <h3 className={'text-xl'}>🍻 Connect With Me!</h3>
          </div>

          <ul className="mx-auto mt-3 grid w-full grid-cols-4 justify-items-center gap-2 md:w-1/2">
            {stats.map((item, index) => (
              <li key={index} className="overflow-hidden py-1">
                <a className="h-10 w-20 fill-sky-500 stroke-sky-700" href={item.url}>
                  {item.icon}
                </a>
              </li>
            ))}
          </ul>
        </div>
      </GlassCard>
    );
  };

  return (
    <main>
      <Metatags
        title="About"
        description="A concise description of the site and it's status"
        currentURL="rafaelzasas.com/about"
      />
      <div className={'container mx-auto dark:text-slate-200'}>
        <Header />
        <GlassCard
          className="mx-5 mb-3 overflow-hidden rounded-lg
                 px-4 py-5 shadow-lg sm:p-6"
        >
          <StatusBadges />
          <ProjectStats />
        </GlassCard>
        <About />
        <RepoStats />
        <Social />
      </div>
    </main>
  );
}
