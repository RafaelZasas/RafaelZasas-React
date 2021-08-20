import Image from 'next/image'

export default function Home() {

    const cards = [

        {
            title: 'Original Website',
            summary: 'Take a look at a mirror image of this website built using Angular',
            source: 'angular-logo.png',
            alt: 'Angular logo',
            url: 'https://rafaelzasas.com'
        }, {
            title: 'GitHub',
            summary: 'View source code of my projects & contributions to the OSS community.',
            source: 'github-logo.png',
            alt: 'GitHub logo',
            url: 'https://github.com/RafaelZasas'
        }, {
            title: 'Projects',
            summary: 'Some personal projects I\'m working on. Leave a feature request for anything you\'d like to see!',
            source: 'projects-logo.jpg',
            alt: 'Projects',
            url: '/projects'
        }, {
            title: 'LinkedIn',
            summary: 'Connect with me on LinkedIn- Send me a message!',
            source: 'linkedin-logo.png',
            alt: 'LinkedIn logo',
            url: 'https://www.linkedin.com/in/rafael-zasas/'
        }, {
            title: 'Resume',
            summary: 'Currently working as a privately contracted software developer but looking for a full time position.',
            source: 'resume-logo.jpg',
            alt: 'resume',
            url: '/resume'
        }, {
            title: 'Stack Overflow',
            summary: 'Check out my Stack Overflow user page to see questions and answers I\'ve posted.',
            source: 'stack-overflow-logo.png',
            alt: 'Stack Overflow logo',
            url: 'https://stackoverflow.com/users/10673068/rafael-zasas'
        },

    ]

    return (
        <div className='p-10'>
            <ul role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-1 sm:gap-x-8 lg:grid-cols-3 xl:gap-x-3">
                {cards.map((card, index) => (
                    <li key={index} className="relative">
                        <a href={card.url}>
                            <div
                                className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                                <Image src={card.source} alt={card.alt}
                                       width={1200}
                                       height={800}
                                       className="object-cover pointer-events-none group-hover:bounce"/>
                            </div>
                            <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{card.title}</p>
                            <p className="mt-1 block text-sm font-medium text-gray-500 pointer-events-none">{card.summary}</p>

                        </a>
                    </li>
                ))}
            </ul>
        </div>
    )
}
