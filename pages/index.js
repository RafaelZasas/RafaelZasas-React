import githubLogo from '../lib/github-logo.png'
import stackOverflowLogo from '../lib/stack-overflow-logo.png'
import resumeLogo from '../lib/resume-logo.jpg'
import linkedInLogo from '../lib/linkedin-logo.png'
import projectsLogo from '../lib/projects-logo.jpg'
import angularLogo from '../lib/angular-logo.png'

import Image from 'next/image'


export default function Home() {

    const cards = [

        {
            title: 'Other Website',
            summary: 'Take a look at a mirror image of this website but built in Angular',
            source: angularLogo
        }, {
            title: 'GitHub',
            summary: '3.9 MB',
            source: githubLogo
        }, {
            title: 'Projects',
            summary: '3.9 MB',
            source: projectsLogo
        }, {
            title: 'LinkedIn',
            summary: '3.9 MB',
            source: linkedInLogo
        }, {
            title: 'Resume',
            summary: '3.9 MB',
            source: resumeLogo
        }, {
            title: 'Stack Overflow',
            summary: '3.9 MB',
            source: stackOverflowLogo
        },

    ]

    return (
        <div className='p-10'>
            <ul role="list"
                className="grid grid-cols-2 gap-x-4 gap-y-8 sm:grid-cols-3 sm:gap-x-6 lg:grid-cols-3 xl:gap-x-3">
                {cards.map((card) => (
                    <li key={card.source} className="relative">
                        <div
                            className="group block w-full aspect-w-10 aspect-h-7 rounded-lg bg-gray-100 focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-offset-gray-100 focus-within:ring-indigo-500 overflow-hidden">
                            <Image src={card.source} alt=""
                                   className="object-cover pointer-events-none group-hover:bounce"/>

                        </div>
                        <p className="mt-2 block text-sm font-medium text-gray-900 truncate pointer-events-none">{card.title}</p>
                        <p className="block text-sm font-medium text-gray-500 pointer-events-none">{card.summary}</p>
                    </li>
                ))}
            </ul>
        </div>
    )
}
