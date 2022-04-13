import Image from 'next/image';
import { useState } from 'react';
import { profileNFTImages } from '_constants/dev';
import { Profile } from '_types/Profile';
import { GiPlainCircle } from 'react-icons/gi';
import { MdWork } from 'react-icons/md';
import { FaUserCheck } from 'react-icons/fa';

type ProfileCardProps = {
  profile: Profile;
  shortened?: boolean;
  alwaysExpanded?: boolean;
};

const ProfileCard = (props: ProfileCardProps) => {
  const ruler = <hr className='w-2/3 mx-auto border-primary'></hr>;

  const [isExpanded, setIsExpanded] = useState(props.alwaysExpanded ? true : false);

  const expandButton = (
    <button
      className='absolute text-2xl font-bold top-1 right-4 text-backgroundLight'
      onClick={() => setIsExpanded(!isExpanded)}
    >
      {isExpanded ? '-' : '+'}
    </button>
  );

  const lookingForProjectBadge = (
    <div className='flex items-center justify-center -mt-4 -mb-2'>
      <div className='rounded-md flex text-sm bg-primaryDark px-2 py-1 gap-1.5 items-center'>
        <div>Looking For Project</div>
        <div className='-mt-0.5'>
          <MdWork size={16} />
        </div>
      </div>
    </div>
  );

  let containerClassName = 'relative bg-backgroundDark rounded-lg shadow-lg w-full pt-11 pb-4 flex flex-col gap-6';

  containerClassName += props.alwaysExpanded
    ? ' '
    : isExpanded
    ? ' max-h-[1000px] min-h-[600px] overflow-y-scroll'
    : ' ';

  return (
    <div className={containerClassName}>
      {!props.alwaysExpanded && expandButton}

      <div className='grid items-center grid-cols-2 gap-8 mb-4'>
        <div className='flex justify-end'>
          <div className='flex'>
            <div className={styles.imageContainer}>
              <Image
                src={
                  props.profile.profilePicture
                    ? props.profile.profilePicture
                    : profileNFTImages[props.profile.displayName.length % 5]
                }
                height={130}
                width={130}
                unoptimized={true}
              />
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center h-full gap-1 mt-1 break-words'>
          {props.profile.admin ? (
            <div className='flex flex-row items-center gap-1'>
              <FaUserCheck size={16} />
              <div>Admin</div>
            </div>
          ) : null}
          <div className='font-bold break-words'>{props.profile.displayName}</div>
          {props.profile.twitterHandle && (
            <div className='break-words text-grey'>
              {props.profile.twitterHandle.startsWith('@')
                ? props.profile.twitterHandle
                : '@' + props.profile.twitterHandle}
            </div>
          )}
          {props.profile.discordUsername && (
            <div className='break-words text-grey'>{props.profile.discordUsername}</div>
          )}
          {props.profile.timezone && <div className='break-words text-grey'>{props.profile.timezone}</div>}
        </div>
      </div>

      {props.profile.lookingForProject === true && lookingForProjectBadge}

      <div className='flex flex-col w-10/12 mx-auto gap-y-4'>
        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionHeading}>Bio</div>
          <div className={styles.sectionParagraph}>{props.profile.bio.replace('<br/>', '\n')}</div>
        </div>

        {props.profile.tags && props.profile.tags.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Tags</div>
              <div className='flex flex-wrap justify-center gap-2'>
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

        {isExpanded ? (
          <>
            {props.profile.skills && props.profile.skills.length ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Skills</div>
                  <div className={styles.sectionBulletpoints}>
                    {props.profile.skills.map((skill) => (
                      <div key={skill} className='flex items-center justify-center gap-2'>
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
                  <div className={styles.sectionParagraph}>{props.profile.experience.replace('<br/>', '\n')}</div>
                </div>
              </>
            ) : null}

            {props.profile.contacts ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Contacts</div>
                  <div className={styles.sectionParagraph}>{props.profile.contacts.replace('<br/>', '\n')}</div>
                </div>
              </>
            ) : null}

            {props.profile.languages && props.profile.languages.length ? (
              <>
                {ruler}

                <div className={styles.sectionContainer}>
                  <div className={styles.sectionHeading}>Languages</div>
                  <div className='flex flex-wrap justify-center gap-2'>
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
                      <div key={link} className='flex items-center justify-center gap-2 text-grey hover:text-white'>
                        <div>
                          <GiPlainCircle size={8} />
                        </div>
                        {link.startsWith('https://') ? (
                          <a href={link} className='break-all'>
                            {link.replace('https://', '')}
                          </a>
                        ) : (
                          <a href={`https://${link}`} className='break-all'>
                            {link}
                          </a>
                        )}
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
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pb-2 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap flex justify-center',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
