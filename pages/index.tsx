import Image from 'next/image';
import Metatags from '../components/Metatags';
import {GetImage} from '../lib/CloudStorageOperations';

export async function getServerSideProps(context) {
  let cards = [
    {
      title: 'Blog',
      summary: 'Take a look, stay a while.',
      source: await GetImage('card-tiles/blog.png'),
      alt: 'Angular logo',
      url: '/blog',
    },
    {
      title: 'GitHub',
      summary: 'View source code of my projects & contributions to the OSS community.',
      source: await GetImage('card-tiles/github-logo.png'),
      alt: 'GitHub logo',
      url: 'https://github.com/RafaelZasas',
    },
    {
      title: 'Projects',
      summary: "Some personal projects I'm working on. Leave a feature request for anything you'd like to see!",
      source: await GetImage('card-tiles/projects-logo.jpg'),
      alt: 'Projects',
      url: '/projects',
    },
    {
      title: 'LinkedIn',
      summary: 'Connect with me on LinkedIn- Send me a message!',
      source: await GetImage('card-tiles/linkedin-logo.png'),
      alt: 'LinkedIn logo',
      url: 'https://www.linkedin.com/in/rafael-zasas/',
    },
    {
      title: 'Resume',
      summary: 'Currently working as a software engineer for 10X Academy.',
      source: await GetImage('card-tiles/resume-logo.jpg'),
      alt: 'resume',
      url: '/resume',
    },
    {
      title: 'Stack Overflow',
      summary: "Check out my Stack Overflow user page to see questions and answers I've posted.",
      source: await GetImage('card-tiles/stack-overflow-logo.png'),
      alt: 'Stack Overflow logo',
      url: 'https://stackoverflow.com/users/10673068/rafael-zasas',
    },
  ];

  return {
    props: {cards}, // will be passed to the page component as props
  };
}

export default function Home(props) {
  const customLoader = ({src, width, quality}) => {
    return `${src}?w=${width}&q=${quality || 75}`;
  };
  return (
    <main>
      <Metatags
        title="Homepage"
        description="Homepage for all the main goodies of my site"
        currentURL="rafaelzasas.com/"
      />
      <div className="p-10">
        <ul
          role="list"
          className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-1 sm:gap-x-8 lg:grid-cols-3 xl:gap-x-3"
        >
          {props.cards.map((card, index) => {
            return (
              <li key={index} className="relative">
                <a href={card.url}>
                  <div className="aspect-w-10 aspect-h-7 group block w-full overflow-hidden rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-indigo-500 focus-within:ring-offset-2 focus-within:ring-offset-gray-100">
                    <Image
                      loader={customLoader}
                      src={card.source}
                      alt={card.alt}
                      width={1200}
                      height={800}
                      className="group-hover:bounce pointer-events-none object-cover"
                    />
                  </div>
                  <p className="pointer-events-none mt-2 block truncate text-sm font-medium text-gray-900">
                    {card.title}
                  </p>
                  <p className="pointer-events-none mt-1 block text-sm font-medium text-gray-500">{card.summary}</p>
                </a>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
