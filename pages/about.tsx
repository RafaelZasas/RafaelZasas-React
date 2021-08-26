import {faGithub} from "@fortawesome/free-brands-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export default function AboutPage({}) {

    const Header = () => {
        return (
            <div className='max-w-2xl mx-auto text-center pt-16 px-4 sm:pt-8 sm:px-6 lg:px-8 mb-2'>
                <h1 className='text-3xl sm:text-4xl'>
                    <span className='block'>
                        Hello, folks!
                    </span>
                </h1>


                <img
                    className='inline-block align-middle mt-2'
                    src="https://raw.githubusercontent.com/MartinHeinz/MartinHeinz/master/wave.gif"
                    width="30px"/>


                <div className='flex-auto  justify-center mt-3 text-2xl'>
                    <p className='whitespace-normal'>
                        Welcome to the
                        React version of my Website
                    </p>
                    <img
                        src="https://upload.wikimedia.org/wikipedia/commons/thumb/a/a7/React-icon.svg/1280px-React-icon.svg.png"
                        className="inline-block align-middle mt-2 sm:h-8 md:h-10 lg:h-14 h-8"/>

                </div>

            </div>
        )
    }

    const StatusBadges = () => {

        const stats = [
            {
                url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/build-test.yml',
                src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/build-test.yml/badge.svg',
                alt: 'built-test'
            },
            {
                url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/dev-deploy.yml',
                src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/dev-deploy.yml/badge.svg',
                alt: 'Dev Deploy'
            },
            {
                url: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/live-deploy.yml',
                src: 'https://github.com/RafaelZasas/RafaelZasas-React/actions/workflows/live-deploy.yml/badge.svg',
                alt: 'Live Deploy'
            },

        ]


        return (
            <div className={'flex flex-col mt-6'}>
                <h3 className={'text-xl text-center'}>
                    🚀 Build and Deployment Status
                </h3>

                <ul className="mt-3 mx-16 grid grid-cols-1 gap-0 sm:grid-cols-3 place-items-center">
                    {stats.map((item, index) => (
                        <li key={index}
                            className="px-4 py-1 overflow-hidden sm:p-0">
                            <a href={item.url}>
                                <img
                                    src={item.src}
                                    alt={item.alt}/>
                            </a>
                        </li>
                    ))}
                </ul>

            </div>
        )
    }
    const ProjectStats = () => {

        const stats = [
            {
                url: 'https://img.shields.io/tokei/lines/github/RafaelZasas/RafaelZasas-React',
                alt: 'lines of code'
            }, {
                url: 'https://img.shields.io/github/contributors/RafaelZasas/RafaelZasas-React',
                alt: 'Contributors'
            }, {
                url: 'https://img.shields.io/github/issues/RafaelZasas/RafaelZasas-React',
                alt: 'issues'
            }, {
                url: 'https://img.shields.io/github/issues-pr/RafaelZasas/RafaelZasas-React',
                alt: 'Pull Requests'
            },
        ]


        return (
            <div className={'flex flex-col mt-6'}>
                <h3 className={'text-xl text-center'}>
                    📈 Project Stats
                </h3>
                <ul className="mt-3 mx-16 grid grid-cols-1 gap-0 sm:grid-cols-4 place-items-center">
                    {stats.map((item, index) => (
                        <li key={index}
                            className="px-4 py-1 overflow-hidden sm:p-3">
                            <img
                                src={item.url}
                                alt={item.alt}/>
                        </li>
                    ))}
                </ul>
            </div>

        )
    }

    const About = () => {
        return (
            <div
                className="mb-3 mx-5 px-4 py-5 shadow-lg rounded-lg overflow-hidden sm:p-6
                 bg-clip-padding bg-white bg-opacity-20 backdrop-filter">
                <div
                    className='font-sans font-bold lg:text-lg sm:text-lg max-w-2xl mx-auto text-center pt-2 px-4 sm:pt-3 sm:px-3 lg:px-5'>
                    <p>I made this site to learn about React and NextJs but also to give people the opportunity to see a
                        live
                        example of the pros and cons of each framework. It also allows me to show my proficiency in
                        React for any potential job recruiters.</p>
                    <br/>
                    <p>This site was built using React and NextJs, is styled using Tailwind CSS and is hosted on
                        Vercel with backend operations done through Firebase.</p>
                    <br/>
                    <p>The codebase for this site can be viewed <a className='text-blue-500 underline'
                                                                   href="https://github.com/rafaelzasas/RafaelZasas-React">Here</a>.
                    </p>
                    <p>There is also a Angular version of my website which can be viewed <a
                        className='text-blue-500 underline' href="https://rafaelzasas.com">Here</a>.</p>
                </div>
            </div>
        )
    }

    const RepoStats = () => {

        const stats = [
            {
                src: 'https://img.shields.io/github/watchers/RafaelZasas/RafaelZasas-React?style=social',
                alt: 'Watchers'
            },
            {
                src: 'https://img.shields.io/github/stars/rafaelzasas/RafaelZasas-React?style=social',
                alt: 'Stars'
            },
            {
                src: 'https://img.shields.io/github/forks/rafaelzasas/RafaelZasas-React?style=social',
                alt: 'Forks'
            },

        ]


        return (
            <div
                className="mb-3 mx-5 px-4 py-5 shadow-lg rounded-lg overflow-hidden sm:p-6
                 bg-clip-padding bg-white bg-opacity-20 backdrop-filter ">
                <div className={'flex flex-col justify-center mt-6'}>

                    <div className={'flex justify-center'}>
                        <FontAwesomeIcon icon={faGithub} className={'inline-block h-full mr-1 mt-1.5'}/>
                        <h3 className={'text-xl '}>
                            Repo Stats
                        </h3>
                    </div>

                    <ul className="mt-3 mx-16 grid grid-cols-1 gap-0 sm:grid-cols-3 place-items-center">
                        {stats.map((item, index) => (
                            <li key={index}
                                className="px-4 py-1 overflow-hidden sm:p-0">
                                <img
                                    src={item.src}
                                    alt={item.alt}/>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }

    const Social = () => {

        const stats = [
            {
                src: 'https://image.flaticon.com/icons/png/512/2111/2111463.png',
                url: 'https://instagram.com/rafaelzasas',
                alt: 'Instagram'
            },
            {
                src: 'https://image.flaticon.com/icons/png/512/733/733579.png',
                url: 'https://twitter.com/rafaelzasas',
                alt: 'Twitter'
            },
            {
                src: 'https://image.flaticon.com/icons/png/512/977/977597.png',
                url: 'https://rafaelzasas.com',
                alt: 'Website'
            },
            {
                src: 'https://image.flaticon.com/icons/png/512/174/174857.png',
                url: 'https://linkedin.com/in/rafael-zasas',
                alt: 'LinkedIn'
            },

        ]


        return (
            <div
                className="mb-3 mx-5 px-4 py-5 shadow-lg rounded-lg overflow-hidden sm:p-6
                 bg-clip-padding bg-white bg-opacity-20 backdrop-filter bg-blend-multiply">
                <div className={'flex flex-col justify-center mt-6'}>

                    <div className={'flex justify-center mb-2'}>
                        <h3 className={'text-xl'}>
                            🍻 Connect With Me!
                        </h3>
                    </div>

                    <ul className="mt-3 mx-4 md:mx-8 lg:mx-16 grid-cols-4 grid gap-0 place-items-center">
                        {stats.map((item, index) => (
                            <li key={index}
                                className="p-0 md:px-4 lg:px-4 py-1 overflow-hidden sm:p-0">
                                <a href={item.url}>
                                    <img
                                        className={'h-5 lg:h-15 md:h-10'}
                                        src={item.src}
                                        alt={item.alt}/>
                                </a>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        )
    }


    return (
        <div className={'container mx-auto'}>
            <Header/>
            <div
                className="mb-3 mx-5 px-4 py-5 shadow-lg rounded-lg overflow-hidden sm:p-6
                 bg-clip-padding bg-white bg-opacity-20 backdrop-filter ">
                <StatusBadges/>
                <ProjectStats/>
            </div>
            <About/>
            <RepoStats/>
            <Social/>
        </div>
    )
}
