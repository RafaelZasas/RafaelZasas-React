import Image from 'next/image';
import Link from 'next/link';

const projects = [
    {
        title: 'Password Generator',
        img: 'lock-icon.png',
        link: 'projects/password-generator'
    }
]

export default function ProjectsPage({ }) {
    return (
        <div className={'flex flex-col mt-6'}>
            <h1 className={'font-bold text-2xl font-gray-700 text-center'}>Projects</h1>
            <div className={'flex flex-wrap my-6 mx-4 justify-center'}>
                {projects.map((project, index) => {
                    return (
                        <Link key={index} href={project.link}>
                            <a 
                                className='static inline-block align-top bg-blue-200 rounded-2xl w-full sm:w-auto md:max-w-md
                                   px-4 pt-5 pb-4 my-4 md:mx-4 text-left overflow-hidden shadow-xl
                                    transform transition-all z-0'>
                                <div className='flex flex-col'>
                                    <h2 className={'text-center font-semibold text-xl'}>{project.title}</h2>
                                    <Image
                                        className="mx-auto"
                                        width={300}
                                        height={300}
                                        src={project.img} alt=" headerImg" />
                                </div>

                            </a>
                        </Link>
                    )
                })}
            </div>
        </div>
    )
}
