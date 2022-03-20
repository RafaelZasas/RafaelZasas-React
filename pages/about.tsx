import {faGithub} from '@fortawesome/free-brands-svg-icons';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import Metatags from '../components/Metatags';

export default function AboutPage({}) {
  const Header = () => {
    return (
      <div className="mx-auto mb-2 max-w-2xl px-4 pt-16 text-center sm:px-6 sm:pt-8 lg:px-8">
        <h1 className="text-3xl sm:text-4xl">
          <span className="block">Hello, folks!</span>
        </h1>

        <img
          className="mt-2 inline-block align-middle"
          src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif"
          width="30px"
        />

        <div className="mt-3  flex-auto justify-center text-2xl">
          <p className="whitespace-normal">Welcome to the React version of my Website</p>
          <img
            src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
            className="mt-2 inline-block h-8 align-middle sm:h-8 md:h-10 lg:h-14"
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
        url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/dev-deploy.yml',
        src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/dev-deploy.yml/badge.svg',
        alt: 'Dev Deploy',
      },
      {
        url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/live-deploy.yml',
        src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/live-deploy.yml/badge.svg',
        alt: 'Live Deploy',
      },
    ];

    return (
      <main>
        <Metatags
          title="About"
          description="A concise description of the site and it's status"
          currentURL="rafaelzasas.com/about"
        />

        <div className={'mt-6 flex flex-col'}>
          <h3 className={'text-center text-xl'}>🚀 Build and Deployment Status</h3>

          <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-3">
            {stats.map((item, index) => (
              <li key={index} className="overflow-hidden px-4 py-1 sm:p-0">
                <a href={item.url}>
                  <img src={item.src} alt={item.alt} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </main>
    );
  };
  const ProjectStats = () => {
    const stats = [
      {
        url: 'https://img.shields.io/tokei/lines/github/RafaelZasas/RafaelZasas-React',
        alt: 'lines of code',
      },
      {
        url: 'https://img.shields.io/github/contributors/RafaelZasas/RafaelZasas-React',
        alt: 'Contributors',
      },
      {
        url: 'https://img.shields.io/github/issues/RafaelZasas/RafaelZasas-React',
        alt: 'issues',
      },
      {
        url: 'https://img.shields.io/github/issues-pr/RafaelZasas/RafaelZasas-React',
        alt: 'Pull Requests',
      },
    ];

    return (
      <div className={'mt-6 flex flex-col'}>
        <h3 className={'text-center text-xl'}>📈 Project Stats</h3>
        <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-4">
          {stats.map((item, index) => (
            <li key={index} className="overflow-hidden px-4 py-1 sm:p-3">
              <img src={item.url} alt={item.alt} />
            </li>
          ))}
        </ul>
      </div>
    );
  };

  const About = () => {
    return (
      <div
        className="mx-5 mb-3 overflow-hidden rounded-lg bg-white bg-opacity-20 bg-clip-padding px-4
                 py-5 shadow-lg backdrop-filter sm:p-6"
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
      </div>
    );
  };

  const RepoStats = () => {
    const stats = [
      {
        src: 'https://img.shields.io/github/watchers/RafaelZasas/RafaelZasas-React?style=social',
        alt: 'Watchers',
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
      <div
        className="mx-5 mb-3 overflow-hidden rounded-lg bg-white bg-opacity-20 bg-clip-padding px-4
                 py-5 shadow-lg backdrop-filter sm:p-6 "
      >
        <div className={'mt-6 flex flex-col justify-center'}>
          <div className={'flex justify-center'}>
            <FontAwesomeIcon icon={faGithub} className={'mr-1 mt-1.5 inline-block h-full'} />
            <h3 className={'text-xl '}>Repo Stats</h3>
          </div>

          <ul className="mx-16 mt-3 grid grid-cols-1 place-items-center gap-0 sm:grid-cols-3">
            {stats.map((item, index) => (
              <li key={index} className="overflow-hidden px-4 py-1 sm:p-0">
                <img src={item.src} alt={item.alt} />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  const Social = () => {
    const stats = [
      {
        src: 'https://image.flaticon.com/icons/png/512/2111/2111463.png',
        url: 'https://instagram.com/rafaelzasas',
        alt: 'Instagram',
      },
      {
        src: 'https://image.flaticon.com/icons/png/512/733/733579.png',
        url: 'https://twitter.com/rafaelzasas',
        alt: 'Twitter',
      },
      {
        src: 'https://image.flaticon.com/icons/png/512/977/977597.png',
        url: 'https://rafaelzasas.com',
        alt: 'Website',
      },
      {
        src: 'https://image.flaticon.com/icons/png/512/174/174857.png',
        url: 'https://linkedin.com/in/rafael-zasas',
        alt: 'LinkedIn',
      },
    ];

    return (
      <div
        className="mx-5 mb-3 overflow-hidden rounded-lg bg-white bg-opacity-20 bg-clip-padding px-4
                 py-5 bg-blend-multiply shadow-lg backdrop-filter sm:p-6"
      >
        <div className={'mt-6 flex flex-col justify-center'}>
          <div className={'mb-2 flex justify-center'}>
            <h3 className={'text-xl'}>🍻 Connect With Me!</h3>
          </div>

          <ul className="mx-4 mt-3 grid grid-cols-4 place-items-center gap-0 md:mx-8 lg:mx-16">
            {stats.map((item, index) => (
              <li key={index} className="overflow-hidden p-0 py-1 sm:p-0 md:px-4 lg:px-4">
                <a href={item.url}>
                  <img className={'lg:h-15 h-5 md:h-10'} src={item.src} alt={item.alt} />
                </a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  };

  return (
    <div className={'container mx-auto'}>
      <Header />
      <div
        className="mx-5 mb-3 overflow-hidden rounded-lg bg-white bg-opacity-20 bg-clip-padding px-4
                 py-5 shadow-lg backdrop-filter sm:p-6 "
      >
        <StatusBadges />
        <ProjectStats />
      </div>
      <About />
      <RepoStats />
      <Social />
    </div>
  );
}
