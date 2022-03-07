import Head from 'next/head';
import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import { richProfile, somProfile } from '_constants/founderProfiles';

const nextHead = (
  <Head>
    <title>About</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
  </Head>
);

export default function About() {
  const title = 'communityTalent';

  const about =
    'communityTalent is a public service platform built to improve the networking, recruiting and community-building abilities of existing web3 communities. Built by two young devs passionate about web3.';

  return (
    <>
      {nextHead}

      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.headingContainer}>
            <h1 className={styles.headingText}>{title}</h1>
          </div>
          <div className={styles.headingContainer}>About</div>
          <div className={styles.profilesContainer}>
            <ProfileCard profile={richProfile} alwaysExpanded />
            <ProfileCard profile={somProfile} alwaysExpanded />
          </div>
          <div className={styles.aboutContainer}>{about}</div>
        </div>
      </div>
    </>
  );
}
const styles = {
  container:
    'flex justify-center min-h-screen text-white break-words bg-background p-5',
  contentContainer: 'w-full max-w-screen-lg flex flex-col gap-12 items-center',
  headingContainer: 'text-primary flex justify-center items-center',
  headingText: 'text-xl font-bold',
  profilesContainer: 'w-full grid grid-cols-1 gap-3 md:grid-cols-2',
  aboutContainer: 'text-center max-w-screen-md leading-loose text-primary',
};
