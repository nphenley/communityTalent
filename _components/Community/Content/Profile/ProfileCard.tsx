import Image from 'next/image';
import { Profile } from '_types/Profile';
import { MdWork } from 'react-icons/md';
import { AiFillTool } from 'react-icons/ai';

type ProfileCardProps = {
  profile: Profile;
};

const ProfileCard = (props: ProfileCardProps) => {
  const ruler = <hr className='border-2 border-primaryDark' />;

  const lookingForProjectBadge = (
    <div className='flex items-center justify-center'>
      <div className='rounded-md flex text-sm text-primary px-2 py-1 gap-1.5 items-center'>
        <div>Looking For Project</div>
        <div className='-mt-0.5'>
          <MdWork size={16} />
        </div>
      </div>
    </div>
  );

  return (
    <div className={styles.container}>
      {props.profile.admin && (
        <div className='absolute flex flex-row items-center gap-1 top-3 left-3 text-primary'>
          <AiFillTool size={20} />
        </div>
      )}

      <div className='grid items-center grid-cols-2 gap-8 mb-4'>
        <div className='flex justify-end'>
          <div className='flex'>
            <div className={styles.imageContainer}>
              <Image src={props.profile.profilePicture!} height={130} width={130} unoptimized={true} />
            </div>
          </div>
        </div>

        <div className='flex flex-col justify-center h-full gap-1 mt-1 break-words'>
          <div className='font-bold break-words'>{props.profile.displayName}</div>
          {props.profile.twitterHandle && <div className='break-words text-grey'>{props.profile.twitterHandle}</div>}
          {props.profile.discordUsername && (
            <div className='break-words text-grey'>{props.profile.discordUsername}</div>
          )}
          {props.profile.timezone && <div className='break-words text-grey'>{props.profile.timezone}</div>}
        </div>
      </div>

      {props.profile.lookingForProject === true && lookingForProjectBadge}

      <div className='flex flex-col w-[80%] gap-y-6'>
        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>{props.profile.bio.replace('<br/>', '\n')}</div>
        </div>

        {props.profile.tags && props.profile.tags.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className='flex flex-wrap gap-1'>
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
      </div>
    </div>
  );
};

export default ProfileCard;

const styles = {
  container: 'relative bg-backgroundDark rounded-lg shadow-lg py-11 flex flex-col items-center gap-6 h-full',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pt-3 pb-3 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap text-grey',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words text-grey',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
