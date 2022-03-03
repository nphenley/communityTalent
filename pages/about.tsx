import Head from 'next/head';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import { richProfile, somProfile } from '_constants/ourProfiles';

export default function About() {
  const title = <h1 className='text-xl font-bold'>communityTalent</h1>;

  const about =
    'communityTalent is a public service platform built to improve the networking, recruiting and community-building abilities of existing web3 communities. Built by two young devs passionate about web3.';

  return (
    <>
      <Head>
        <title>About</title>
        <meta name='viewport' content='initial-scale=1.0, width=device-width' />
      </Head>
      <div className='flex h-screen text-white break-words bg-background'>
        <div className='flex flex-col w-full'>
          <div className={styles.container}>{title}</div>
          <div className={styles.container}>About us</div>
          <div className='grid grid-cols-1 gap-3 px-3 pt-3 md:grid-cols-2'>
            <ProfileCard profile={richProfile} />
            <ProfileCard profile={somProfile} />
          </div>
          <div className='w-2/3 p-3 mx-auto mt-8 border-2 border-backgroundDark text-primary'>
            {about}
          </div>
        </div>
      </div>
    </>
  );
}
const styles = {
  container: 'relative py-5 text-primary flex justify-center items-center',
};
