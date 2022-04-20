import ProfileCard from '_components/Community/Content/Profile/ProfileCard';
import { richProfile, somProfile } from '_constants/founderProfiles';

export default function About() {
  return (
    <>
      <div className={styles.container}>
        <div className={styles.contentContainer}>
          <div>
            <h2 className={styles.headingText}>About</h2>
            <div className={styles.aboutContainer}>{about}</div>
          </div>

          <div>
            <h2 className={styles.headingText}>The Founders</h2>
            <div className={styles.profilesContainer}>
              <ProfileCard profile={richProfile} />
              <ProfileCard profile={somProfile} />
            </div>
          </div>

          <div>
            <h2 className={styles.headingText}>Frequently Asked Questions</h2>
            <div className={styles.faqContainer}>
              {qAndAs.map((qAndA) => (
                <div id={qAndAs.indexOf(qAndA).toString()} className='flex flex-col gap-2'>
                  <div className={styles.question}>{qAndA.question}</div>
                  <div className={styles.answer}>{qAndA.answer}</div>
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
  container: 'flex justify-center text-white break-words bg-background pt-12 pb-24',
  contentContainer: 'w-full max-w-screen-lg flex flex-col gap-24',
  headingText: 'text-lg font-bold text-primary justify-center flex',
  aboutContainer: 'text-center max-w-screen-md mt-2 mx-auto text-grey font-bold',
  profilesContainer: 'w-full grid grid-cols-1 gap-3 md:grid-cols-2 mt-6',
  faqContainer: 'justify-start flex grid grid-flow-row gap-12 mt-12',
  question: 'text-md font-bold text-primary',
  answer: 'text-sm font-semibold text-grey',
};

const about =
  'communityTalent aims to improve the networking, recruiting and community-building abilities of web3 communities. Users offering web3 skills can create profiles to share with their communities. etc. ';

const qAndAs: { question: string; answer: string }[] = [
  {
    question: 'Which blockchain networks does cTalent support?',
    answer:
      'We currently support most EVM chains and Solana. We plan to continue to expand and add networks to our platform.',
  },
  {
    question: 'I have multiple wallets. How can I link them?',
    answer:
      'On the link wallets page, you can enter wallet addresses and send link requests to your other wallets. This is not limited to a single chain, you can link wallets cross-chain! Once you have sent the requests you will have to connect to those other wallets and accept the requests. You will then be able to see all of your communities from a single wallet.',
  },
  {
    question: 'Why do I need to sign with my wallet when I first connect?',
    answer:
      "This is to verify that you own your wallet. You've likely done this before to verify your NFTs using Collab.Land, this is the same thing and does not give us access to your wallet.",
  },
];
