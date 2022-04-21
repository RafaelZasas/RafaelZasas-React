import Link from 'next/link';
import GlassCard from '../../components/GlassCard';
import CustomImage from '../../components/Image';
import Metatags from '../../components/Metatags';

const projects = [
  {
    title: 'Password Generator',
    img: 'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/card-tiles%2Flock-icon.png?alt=media&token=2bdbe0f1-c224-4b87-950f-84e4e09c7119',
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
        <h1 className={'font-gray-700 text-center text-2xl font-bold dark:text-slate-200'}>Projects</h1>
        <div className={'my-6 mx-4 flex flex-wrap justify-center'}>
          {projects.map((project, index) => {
            return (
              <Link key={index} href={project.link} passHref>
                <GlassCard
                  className="static z-10 my-4 inline-block w-full transform cursor-pointer overflow-hidden rounded-2xl
                         px-4 pt-5 pb-4 text-left align-top shadow-xl transition-all
                                    sm:w-auto md:mx-4 md:max-w-md"
                >
                  <div className="flex flex-col">
                    <h2 className={'text-center text-xl font-semibold dark:text-slate-300'}>{project.title}</h2>
                    <CustomImage className="mx-auto" width={300} height={300} src={project.img} alt=" headerImg" />
                  </div>
                </GlassCard>
              </Link>
            );
          })}
        </div>
      </div>
    </main>
  );
}
