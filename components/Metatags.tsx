import Head from 'next/head';

export default function Metatags({
  title = 'Rafael Zasas',
  description = 'Personal Website built with NextJs by Rafael',
  currentURL = 'rafaelzasas.com',
  image = 'https://firebasestorage.googleapis.com/v0/b/rafael-zasas.appspot.com/o/profile-photo.jpg?alt=media&token=6d133b36-eb83-4bf3-a58d-317bc1eeaf2a',
}) {
  return (
    <Head>
      <title>{title}</title>
      <meta name="twitter:card" content="Personal Website built with NextJs by Rafael" key={'twitterCard'} />
      <meta name="twitter:site" content="@rafaelzasas" key={'twitterSite'} />
      <meta name="twitter:title" content={title} key={'twitterTitle'} />
      <meta name="twitter:description" content={description} key={'twitterDescription'} />
      <meta name="twitter:image" content={image} key={'twitterImage'} />

      {/* Open Graph */}
      <meta property="og:title" content={title} key={'ogtitle'} />
      <meta property="og:description" content={description} key={'ogdescription'} />
      <meta property="og:image" content={image} key={'ogimage'} />
      <meta property="og:site_name" content={'RafaelZasas'} key="ogsitename" />
      <meta property="og:url" content={currentURL} key="ogurl" />
      <meta property="og:locale" content={'en_US'} key="oglocal" />

      {/* Google SEO Tags */}
      <meta name="robots" content="all" key={'robots'} />
      <meta
        name="google-site-verification"
        content="C8tQHSjncBSb4cE7qbz5YC8iPhxNBWvi7BNghCixbxc"
        key={'googleSiteVerification'}
      />
      <meta name="googlebot" content="all" key={'googlebot'} />
      <meta charSet="utf-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1" />
    </Head>
  );
}
