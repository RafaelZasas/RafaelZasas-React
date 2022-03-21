import {useRouter} from 'next/router';

export default function BlogPost() {
  const router = useRouter();
  const {slug} = router.query;
  console.log(slug);
  return <main>Blog Stuff</main>;
}
