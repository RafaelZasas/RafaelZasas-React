import { useState } from "react"
import Modal from "../../components/Modal"

/**
 * 
 * @param param0 
 * @returns 
 */
export default function PasswordGeneratorPage({ }) {
    const [open, setOpen] = useState(false)

    function ModalTitle() {
        return (
            <h1>
                <span className="block text-base text-center text-indigo-600 font-semibold tracking-wide uppercase">
                    A Simple Password Generator Made with
                </span>
                <span className="mt-2 block text-3xl text-center leading-8 font-extrabold tracking-tight text-gray-900 sm:text-4xl">
                    Python | FastAPI | Docker &amp;&amp; Cloud Run
                </span>
            </h1>
        )
    }

    function ModalBody() {
        return (
            <div className="relative py-16 bg-white overflow-hidden">
                <div className="hidden lg:block lg:absolute lg:inset-y-0 lg:h-full lg:w-full">
                    <div className="relative h-full text-lg max-w-prose mx-auto" aria-hidden="true">
                        <svg
                            className="absolute top-12 left-full transform translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="74b3fd99-0a6f-4271-bef2-e80eeafdf357"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#74b3fd99-0a6f-4271-bef2-e80eeafdf357)" />
                        </svg>
                        <svg
                            className="absolute top-1/2 right-full transform -translate-y-1/2 -translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="f210dbf6-a58d-4871-961e-36d5016a0f49"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#f210dbf6-a58d-4871-961e-36d5016a0f49)" />
                        </svg>
                        <svg
                            className="absolute bottom-12 left-full transform translate-x-32"
                            width={404}
                            height={384}
                            fill="none"
                            viewBox="0 0 404 384"
                        >
                            <defs>
                                <pattern
                                    id="d3eb07ae-5182-43e6-857d-35c643af9034"
                                    x={0}
                                    y={0}
                                    width={20}
                                    height={20}
                                    patternUnits="userSpaceOnUse"
                                >
                                    <rect x={0} y={0} width={4} height={4} className="text-gray-200" fill="currentColor" />
                                </pattern>
                            </defs>
                            <rect width={404} height={384} fill="url(#d3eb07ae-5182-43e6-857d-35c643af9034)" />
                        </svg>
                    </div>
                </div>
                <div className="relative px-4 sm:px-6 lg:px-8">
                    <div className="text-lg max-w-prose mx-auto">
                        <p className="text-xl text-gray-500 leading-8">
                            Although making a Random Password Generator is simple enough,
                            Making it easilly accesible to the world is not.
                        </p>
                        <p className="text-xl text-gray-500 font-semibold leading-8 mt-2">
                            at least until you read the rest of this...
                        </p>

                    </div>
                    <div className="mt-6 prose prose-indigo prose-lg text-gray-500 mx-auto">
                        <p>
                            But first, a little bit about this project.
                        </p>
                        <ul role="list">
                            <li>The nuts and bolts of the password generation is happening in standard Python (Python3.9 if you want to be exact)</li>
                            <li>Serving the code over an accessible HTTP endpoint is done with FastAPI</li>
                            <li>The actual serving of the code (where it lives) is on Google Cloud Platform&apos;s Cloud Run Service (More on this later).</li>
                        </ul>
                        <p>
                        </p>
                        <h2>All About FastAPI</h2>
                        <p>
                            Fast API is a super lightweight, web-serving framework for Python.
                            It allows you to create lightning fast end points with beautiful, automated documentation
                            through SwaggerUI and Redoc through the OpenAPI Schema.
                            Some of the alternatives to FastAPI are Django and Flask, but if you&apos;ve ever tried either, you know how fun they are...<br />
                            If you havent, let me tell you, they suck. Well, for small projects at least. They each have their benefits but generally are overkill for a small
                            application that just needs a few simple endpoints.
                        </p>
                        <h2>All About Docker</h2>
                        <p>
                            Docker and Containerization are no longer new- If you are a developer who doesn&apos;t yet about it...
                            You&apos;re doing something wrong.<br />
                            Docker allows you to write a file (a Dockerfile) which lays out instructions for how to build your code.
                            This can include, but is not limited to, installing requirement files (pip or NPM for example), exposing ports,
                            setting environment variables or simply running the code.
                        </p>
                        <p>
                            Once containerized, you can ship off the container image to whoever or wherever you like so long as they or it has Docker installed and can run the container.
                            Things can get really whacky when you try to reason about spawning multiple containers and synchronizing them all.
                            Google came up with a solution for this called Kubernetes,
                            but if you are not a multi-national organization with hundreds of thousands of <abbr title={'Daily Active Users'}>DAU</abbr>,
                            you probably don&apos; need Kubernetes.
                        </p>
                        <h2>All About Cloud Run</h2>
                        <p>
                            Cloud Run is a customizable, serverless-function-solution, for stateless operations which need to be hosted and accessed
                            on a periodic basis (kinda).
                            It allows you to spawn new instances of dockerized containers depending on the volume of requests (I&apos;ll say it again, who tf needs Kubernetes?).
                            <br />
                            You can also integrate GitHub Actions which will automatically triger a new build and deployed version of your code, while allowing you to persist the endpoint for production
                            or deploy with different URL&apos;s for development.<br />
                        </p>
                        <p>
                            One of the greatest strengths of Cloud Run is the pricing model. You see, Cloud Run is very clever, and allows you to set a minimum number of machines running at any given time to 0.
                            This means that if your users aren&apos;nt using your services, the procesing power you rent from google isn&apos;t being used.
                            If it&apos;s not being used, you aren&apos;t being charged.
                        </p>

                        <h2>See it in Action</h2>
                        <p>
                            This project is simple in design, and freely hosted on Github so that you can take a peek at the code to see how it works for yourself.
                            Heck, you can even steal it all together and make a better version.
                        </p>

                        <p>
                            I&apos;ve left all the  neccessary links below so you have no excuse to check them out.<br/>
                            Thanks for reading my little article, I hope you walk away from this learning something new.
                            If not, I&apos;d love to get a coffe with you- <abbr title="Hit Me Up">HMU</abbr>!
                        </p>
                        <div className={'flex flex-col items-center'}>
                        <ul role="list" className={'text-left'} >
                            <li><a target='_blank' rel='noreferrer' href="https://password-generator-ekxrzqcpba-uc.a.run.app/docs">The API itself</a></li>
                            <li><a target='_blank' rel='noreferrer' href="https://github.com/RafaelZasas/Password-Generator">GitHub Repository</a></li>
                            <li><a target='_blank' rel='noreferrer' href="https://fastapi.tiangolo.com/">FastAPI</a></li>
                            <li><a target='_blank' rel='noreferrer' href="https://fastapi.tiangolo.com/">Docker</a></li>
                            <li><a target='_blank' rel='noreferrer' href="https://cloud.google.com/run/docs">Cloud Run</a></li>
                        </ul>
                        </div>

                    </div>
                </div>
            </div>
        )
    }

    const TitleBar = () => {
        return (
            <div className="flex flex-col text-center">
                <h1 className={'text-blue-600 text-2xl font-bold'}>Password Generator</h1>
                <h2 className={'text-gray-600 text-lg font-semibold'}>A random Password Generation API built using Python and FastAPI.</h2>
                <h3 className={'text-gray-600 text-base font-semibold'}>
                    <span
                        onClick={() => setOpen(true)}
                        className={'text-blue-600/75 hover:text-blue-600 cursor-pointer'}>
                        Click Here </span>
                    for more info
                </h3>
            </div>
        )
    }

    return (
        <div className={'flex flex-col mt-4'}>
            <Modal open={open}
                setOpen={setOpen}
                header={<ModalTitle />}
                body={<ModalBody />}
                headerImg={'lock.png'}
            />
            <TitleBar />
        </div>
    )
}