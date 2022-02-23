import Image from 'next/image';
import { useState } from 'react';
import { profileNFTImages } from '_constants/hardcoded';
import { Profile } from '_types/Profile';
import { GiPlainCircle } from 'react-icons/gi';

type ProfileCardProps = {
  profile: Profile;
  alwaysExpanded?: boolean;
};

// TODO:
// Looking for Work badge
// Get Profile Pics properly.
const ProfileCard = (props: ProfileCardProps) => {
  const ruler = <hr className='border-primary'></hr>;

  const [isExpanded, setIsExpanded] = useState(false);

  const expandButton = (
    <button
      className='absolute top-1 right-4 text-backgroundLight font-bold text-2xl'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? '-' : '+'}
    </button>
  );

  return (
    <div className={styles.container}>
      {!props.alwaysExpanded && expandButton}

      <div className='flex items-center justify-center gap-9 mb-4'>
        <div className={styles.imageContainer}>
          <Image
            src={profileNFTImages[props.profile.displayName.length % 5]}
            height={100}
            width={100}
          />
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

      <div className='w-9/12 mx-auto flex flex-col gap-6'>
        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>Bio</div>
          <div className={styles.sectionParagraph}>{props.profile.bio}</div>
        </div>

        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>Tags</div>
          <div className='gap-1 flex'>
            {props.profile.tags &&
              props.profile.tags.map((tag) => (
                <div className={styles.sectionTags}>{tag}</div>
              ))}
          </div>
        </div>

        {props.alwaysExpanded || isExpanded ? (
          <>
            {props.profile.skills && props.profile.skills.length ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Skills</div>
                  <div className={styles.sectionBulletpoints}>
                    {props.profile.skills.map((skill) => (
                      <div className='flex items-center gap-2 '>
                        <GiPlainCircle size={8} className='mt-0.5' /> {skill}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {props.profile.experience ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Experience</div>
                  <div className={styles.sectionParagraph}>
                    {props.profile.experience}
                  </div>
                </div>
              </>
            ) : null}

            {props.profile.languages && props.profile.languages.length ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Languages</div>
                  <div className='gap-1 flex'>
                    {props.profile.languages.map((language) => (
                      <div className={styles.sectionTags}>{language}</div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}

            {props.profile.relevantLinks &&
            props.profile.relevantLinks.length ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Links</div>
                  <div className={styles.sectionBulletpoints}>
                    {props.profile.relevantLinks.map((link) => (
                      <div className='flex items-center gap-2 '>
                        <GiPlainCircle size={8} className='mt-0.5' /> {link}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileCard;

const styles = {
  container:
    'relative bg-backgroundDark rounded-lg shadow-lg w-full py-11 flex flex-col gap-6 overflow-y-scroll min-h-[600px] max-h-[1000px] mx-auto',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pt-2.5 pb-4 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: '',
  sectionBulletpoints: 'gap-1 flex flex-col px-2',
  sectionTags: 'bg-primaryDark py-1 px-3 rounded-lg',
};
