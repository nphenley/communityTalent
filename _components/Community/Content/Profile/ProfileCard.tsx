import Image from 'next/image';
import { useState } from 'react';
import { profileNFTImages } from '_constants/dev';
import { Profile } from '_types/Profile';
import { GiPlainCircle } from 'react-icons/gi';
import { MdWork } from 'react-icons/md';

type ProfileCardProps = {
  profile: Profile;
  alwaysExpanded?: boolean;
};

// TODO:
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

  const lookingForProjectBadge = (
    <div className='flex justify-center items-center -mt-4 -mb-2'>
      <div className='rounded-md flex text-sm bg-primaryDark px-2 py-1 gap-1.5 items-center'>
        <div>Looking For Project</div>
        <div className='-mt-0.5'>
          <MdWork size={16} />
        </div>
      </div>
    </div>
  );

  let containerClassName =
    'relative bg-backgroundDark rounded-lg shadow-lg w-full py-11 flex flex-col gap-6 overflow-y-scroll mx-auto';

  containerClassName += props.alwaysExpanded
    ? ' h-full'
    : isExpanded
    ? ' max-h-[1000px] min-h-[600px]'
    : ' h-[600px]';

  return (
    <div className={containerClassName}>
      {!props.alwaysExpanded && expandButton}

      <div className='grid grid-cols-2 items-center gap-8 mb-4 px-12'>
        <div className='flex justify-end'>
          <div className='flex'>
            <div className={styles.imageContainer}>
              <Image
                src={profileNFTImages[props.profile.displayName.length % 5]}
                height={130}
                width={130}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col h-full justify-center gap-1 break-words mt-2'>
          <div className='font-bold break-words'>
            {props.profile.displayName}
          </div>
          {props.profile.twitterHandle && (
            <div className='text-grey break-words'>
              {props.profile.twitterHandle}
            </div>
          )}
          {props.profile.discordUsername && (
            <div className='text-grey break-words'>
              {props.profile.discordUsername}
            </div>
          )}
        </div>
      </div>

      {props.profile.lookingForProject === true && lookingForProjectBadge}

      <div className='w-9/12 mx-auto flex flex-col gap-6'>
        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>Bio</div>
          <div className={styles.sectionParagraph}>
            {props.profile.bio.replace('<br/>', '\n')}
          </div>
        </div>

        {props.profile.tags && props.profile.tags.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Tags</div>
              <div className='gap-2 flex flex-wrap'>
                {props.profile.tags &&
                  props.profile.tags.map((tag) => (
                    <div key={tag} className={styles.sectionTags}>
                      {tag}
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : null}

        {props.profile.skills && props.profile.skills.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Skills</div>
              <div className={styles.sectionBulletpoints}>
                {props.profile.skills.map((skill) => (
                  <div key={skill} className='flex items-center gap-2'>
                    <div>
                      <GiPlainCircle size={8} />
                    </div>
                    <div className='break-all'>{skill}</div>
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
                {props.profile.experience.replace('<br/>', '\n')}
              </div>
            </div>
          </>
        ) : null}

        {props.profile.contacts ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Contacts</div>
              <div className={styles.sectionParagraph}>
                {props.profile.contacts.replace('<br/>', '\n')}
              </div>
            </div>
          </>
        ) : null}

        {props.profile.languages && props.profile.languages.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Languages</div>
              <div className='gap-2 flex flex-wrap'>
                {props.profile.languages.map((language) => (
                  <div key={language} className={styles.sectionTags}>
                    {language}
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {props.profile.relevantLinks && props.profile.relevantLinks.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Links</div>
              <div className={styles.sectionBulletpoints}>
                {props.profile.relevantLinks.map((link) => (
                  <div
                    key={link}
                    className='flex items-center gap-2 text-grey hover:text-white'
                  >
                    <div>
                      <GiPlainCircle size={8} />
                    </div>
                    <a href={`https://${link}`} className='break-all'>
                      {link}
                    </a>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}
      </div>
    </div>
  );
};

export default ProfileCard;

const styles = {
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pt-2.5 pb-4 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
