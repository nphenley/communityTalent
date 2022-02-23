import Image from 'next/image';
import { profileNFTImages } from '_constants/hardcoded';
import { Profile } from '_types/Profile';

type ProfileCardProps = {
  profile: Profile;
};

// TODO:
// Looking for Work badge
const ProfileCard = (props: ProfileCardProps) => {
  const ruler = <hr className='border-primary'></hr>;

  return (
    <div className={styles.container}>
      <div className='flex items-center justify-center gap-9 mb-4'>
        <div className={styles.imageContainer}>
          <Image src={profileNFTImages[2]} height={140} width={140} />
        </div>
        <div className='flex flex-col h-full justify-center gap-1 mt-3'>
          <div className='font-bold'>{props.profile.displayName}</div>
          {props.profile.displayName && (
            <div className='text-grey'>@{props.profile.displayName}</div>
          )}
          <div className='text-grey'>
            {props.profile.displayName && props.profile.displayName}#3200
          </div>
        </div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Bio</div>
        <div>{props.profile.bio}</div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Tags</div>
        <div className='gap-1 flex'>
          {props.profile.tags &&
            props.profile.tags.map((tag) => (
              <div className='bg-primaryDark py-1 px-3 rounded-lg'>{tag}</div>
            ))}
        </div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Skills</div>
        <div className='gap-1 flex flex-col px-2'>
          {props.profile.skills &&
            props.profile.skills.map((skill) => <div>- {skill}</div>)}
        </div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Experience</div>
        <div>{props.profile.experience}</div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Languages</div>
        <div className='gap-1 flex'>
          {props.profile.languages &&
            props.profile.languages.map((language) => (
              <div className='bg-primaryDark py-1 px-3 rounded-lg'>
                {language}
              </div>
            ))}
        </div>
      </div>

      {ruler}

      <div className={styles.sectionContainer}>
        <div className={styles.sectionHeading}>Links</div>
        <div className='gap-1 flex flex-col px-2'>
          {props.profile.relevantLinks &&
            props.profile.relevantLinks.map((link) => <div>- {link}</div>)}
        </div>
      </div>
    </div>
  );
};

export default ProfileCard;

const styles = {
  container:
    'relative bg-backgroundDark rounded-lg shadow-lg w-full max-w-[550px] px-11 py-11 flex flex-col gap-6 overflow-y-scroll max-h-[1000px]',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pt-2.5 pb-4 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
};
