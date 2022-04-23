import { O_DIRECTORY } from 'constants';
import Head from 'next/head';

const nextHead = (
  <Head>
    <title>Sales Pitch</title>
    <meta name='viewport' content='initial-scale=1.0, width=device-width' />
  </Head>
);

export enum HomeSection {
  COMMUNITIES,
  WALLETGROUPS,
}

const Sales = () => {
  return (
    <div className={styles.container}>
      {nextHead}
      <div className={styles.contentContainer}>
        <h2 className={styles.headingText}>The current problem</h2>
        NFT Projects currently rely on Discord as a platform for all their holders to interact with and see each other -
        often projects have some sort of skill sets or introduction channel, but messages in those usually get buried
        very quickly, and people don't usually scroll through those looking for potentially out-of-date messages.
        There's no web-app UI anywhere currently that lets community members easily visualise other members of the
        community's skill sets.
        <h2 className={styles.headingText}>Our service</h2>
        We've built a platform that aims to both provide a platform for finding trustworthy builders, and improve the
        networking, recruiting, and community-building abilities of web3 communities:
        <ul className='ml-4 list-disc'>
          <li>Community members can set up comprehensive profile cards and project postings.</li>
          <li className='pt-2'>
            Communities have a directory representing all the talent looking to build in their community, and all the
            projects their community members are working on.
          </li>
          <img className='mt-5 rounded-lg' src={'assets/directory.png'} />
        </ul>
        Members looking to start projects can now prioritize finding collaborators from within their own communities
        first. We think it'll really boost the community feel that active builders will be able to more easily see what
        kind of talent is available for collaboration within their NFT community.
        <h2 className={styles.headingText}>Our style</h2>
        We approach high-quality projects that we think have high-value members (people genuinely looking to build
        trustworthy reputations, and that are excited to be a part of the NFT ecosystem) If those high-quality projects
        want to be added to our app:
        <ul className='ml-4 list-disc'>
          <li>Their NFTs would be given permission to access the All CommunityTalent page </li>
          <li className='pt-2'>
            A private CommunityTalent page is created and added to the site, where only holders of that collection can
            enter.
          </li>
          <img className='mt-5 rounded-lg' src={'assets/communities.png'} />
        </ul>
        The Public Community is a page that's a collaboration between all of our client communities and Private
        Community pages are pages with restricted access. To enter, someone will require the community NFT.
        <h2 className={styles.headingText}>Payment</h2>
        Projects that want to be integrated can subscribe to our platform for 2 SOL/month or 0.07 ETH/month. DM @somkoda
        or @richpepsi_ on Twitter to get in touch!
      </div>
    </div>
  );
};

export default Sales;

const styles = {
  container: 'flex justify-center text-white break-words bg-background pt-12 px-4 pb-24',
  contentContainer: 'w-full max-w-screen-md flex flex-col gap-12',
  headingText: 'text-2xl font-bold text-primary justify-center flex',
};
