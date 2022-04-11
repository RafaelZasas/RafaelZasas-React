import Link from 'next/link';
import CustomImage from '../../components/Image';
import Metatags from '../../components/Metatags';

const projects = [
  {
    title: 'Password Generator',
    img: 'lock-icon.png',
    link: 'projects/password-generator',
  },
];

export default function ProjectsPage({}) {
  return (
    <main>
      <Metatags
        title="Projects"
        description="Take a look at all the cool projects I'm working on"
        currentURL="rafaelzasas.com/projects"
      />
      <div className={'mt-6 flex flex-col'}>
        <h1 className={'font-gray-700 text-center text-2xl font-bold'}>Projects</h1>
        <div className={'my-6 mx-4 flex flex-wrap justify-center'}>
          {projects.map((project, index) => {
            return (
              <Link key={index} href={project.link}>
                <a
                  className="static z-0 my-4 inline-block w-full transform overflow-hidden rounded-2xl
                                   bg-blue-200 px-4 pt-5 pb-4 text-left align-top shadow-xl transition-all
                                    sm:w-auto md:mx-4 md:max-w-md"
                >
                  <div className="flex flex-col">
                    <h2 className={'text-center text-xl font-semibold'}>{project.title}</h2>
                    <CustomImage className="mx-auto" width={300} height={300} src={project.img} alt=" headerImg" />
                  </div>
                </a>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
