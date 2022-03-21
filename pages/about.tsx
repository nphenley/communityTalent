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
    'communityTalent is a public service platform that aims to improve the networking, recruiting and community-building abilities of web3 communities. Built by two young devs passionate about web3, it allows the people offering web3 skills to create their own extended profiles and the people seeking those skills to describe exactly what they are looking for. communityTalent provides the social layer missing from web3 and should benefit all its communities by making it easier for builders and people with common interests to find each other. ';

  return (
    <>
      {nextHead}

      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div className={styles.titleContainer}>
            <h1 className={styles.titleText}>{title}</h1>
          </div>
          <h1 className={styles.headingText}>About</h1>
          <div className={styles.aboutContainer}>{about}</div>
          <h1 className={styles.headingText}>The Founders</h1>

          <div className={styles.profilesContainer}>
            <ProfileCard profile={richProfile} alwaysExpanded />
            <ProfileCard profile={somProfile} alwaysExpanded />
          </div>
          <h1 className={styles.headingText}>Frequently Asked Questions</h1>
          <div className={styles.faqContainer}>
            <div className='grid grid-flow-row gap-6'>
              {qAndAs.map((qAndA) => (
                <div id={qAndAs.indexOf(qAndA).toString()}>
                  <div className=''>
                    <div className={styles.question}>{qAndA.question}</div>
                    <div className={styles.answer}>{qAndA.answer}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
const styles = {
  container:
    'flex justify-center min-h-screen text-white break-words bg-background p-5',
  contentContainer: 'w-full max-w-screen-lg flex flex-col gap-10',
  titleContainer: 'text-primary flex justify-center items-center',
  titleText: 'text-xl font-bold',
  faqContainer: 'text-primary justify-start flex flex-col',
  headingText: 'text-lg font-bold text-primary justify-center flex',
  profilesContainer: 'w-full grid grid-cols-1 gap-3 md:grid-cols-2',
  aboutContainer:
    'text-center max-w-screen-md leading-loose text-primary mx-auto text-pink-300',
  question: 'text-md font-bold underline pb-2',
  answer: 'text-sm pl-5 font-semibold text-pink-300',
};

const qAndAs: { question: string; answer: string }[] = [
  {
    question: 'What blockchains does cTalent support?',
    answer:
      'We currently support most EVM chains and Solana. We plan to continue to expand and add networks to our platform.',
  },
  {
    question: 'How do I link my wallets?',
    answer:
      'On the link wallets page, you can enter wallet addresses and send link requests to your other wallets. This is not limited to a single chain, you can link wallets cross-chain! Once you have sent the requests you will have to connect on those other wallets and accept the requests. You will then be able to see all of your communities from a single wallet.',
  },
  {
    question: 'How many communities have you added to cTalent?',
    answer:
      'Every single community comprising of NFTs on EVM chains can be created seemlessly by users. However, if the NFTs can be staked we will need to add the staking address to our backend so that you can see your staked NFTs. Unfortunately, NFTs on Solana need to be added manually.',
  },
  {
    question: 'Why do I have to sign my wallet?',
    answer:
      "This is to verify that you own your wallet. You've likely done this before to verify your NFTs using Collab.Land, this is the same thing and does not give us access to your wallet.",
  },
];
