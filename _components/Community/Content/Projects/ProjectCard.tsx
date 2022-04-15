import { Project } from '_types/Project';
import { AiFillDelete, AiFillEdit, AiFillTool, AiOutlineTwitter } from 'react-icons/ai';
import { GiPlainCircle } from 'react-icons/gi';
import { FaDiscord } from 'react-icons/fa';
import { useContext } from 'react';
import { WalletGroupContext } from '_contexts/WalletGroupContext';

type ProjectCardProps = {
  project: Project;
  setProjectToEdit: any;
  deleteProject: any;
};

const ProjectCard = (props: ProjectCardProps) => {
  const walletGroupID = useContext(WalletGroupContext);

  const ruler = <hr className='border-primaryDark border-2 mb-2' />;

  return (
    <div className={styles.container}>
      {props.project.isAdminProject && (
        <div className='absolute top-3 left-3 flex flex-row items-center gap-1 text-primary'>
          <AiFillTool size={20} />
        </div>
      )}

      {props.project.walletGroupID === walletGroupID && (
        <div className='absolute right-2 top-2 flex gap-1'>
          <div
            className='flex bg-primaryDark rounded-full flex-row items-center gap-1 text-grey p-1 hover:bg-primary hover:text-white hover:cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              props.setProjectToEdit(props.project);
            }}
          >
            <AiFillEdit size={16} />
          </div>
          <div
            className='flex bg-primaryDark rounded-full flex-row items-center gap-1 text-grey p-1 hover:bg-primary hover:text-white hover:cursor-pointer'
            onClick={(e) => {
              e.stopPropagation();
              props.deleteProject();
            }}
          >
            <AiFillDelete size={16} />
          </div>
        </div>
      )}

      <div>
        <div className='flex gap-1 items-center'>
          <div className='text-grey'>Looking for:</div>
          <div className={styles.sectionHeading}>{props.project.role}</div>
        </div>
      </div>
      <div className='flex flex-col w-[85%] gap-y-6'>
        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>{props.project.description.replace('<br/>', '\n')}</div>
        </div>

        {props.project.skills && props.project.skills.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Skills</div>
              <div className={styles.sectionBulletpoints}>
                {props.project.skills.map((skill) => (
                  <div key={skill} className='flex items-center gap-2 text-grey'>
                    <div>
                      <GiPlainCircle size={8} />
                    </div>
                    <div>{skill}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : null}

        {props.project.languages && props.project.languages.length ? (
          <>
            {ruler}

            <div className={styles.sectionContainer}>
              <div className='flex flex-wrap gap-1'>
                {props.project.languages &&
                  props.project.languages.map((language) => (
                    <div key={language} className={styles.sectionTags}>
                      {language}
                    </div>
                  ))}
              </div>
            </div>
          </>
        ) : null}

        {props.project.twitterContact || props.project.discordContact ? (
          <>
            {ruler}
            <div className={styles.sectionContainer}>
              <div className={styles.sectionHeading}>Contact</div>
              <div className={styles.sectionBulletpoints}>
                {props.project.discordContact && (
                  <div className='flex items-center gap-2 text-grey'>
                    <div>
                      <FaDiscord size={15} />
                    </div>
                    <div>{props.project.discordContact}</div>
                  </div>
                )}
                {props.project.twitterContact && (
                  <div className='flex items-center gap-2 text-grey'>
                    <div>
                      <AiOutlineTwitter size={15} />
                    </div>
                    <div>@{props.project.twitterContact}</div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : null}
      </div>
      <div className='absolute bottom-[3%] right-[5%] text-grey text-sm'>
        <div>by {props.project.creatorDisplayName}</div>
      </div>
    </div>
  );
};

export default ProjectCard;

const styles = {
  container: 'relative bg-backgroundDark rounded-lg shadow-lg pt-8 pb-8 flex flex-col items-center gap-6 h-full',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pb-3 gap-3 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap text-grey',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words text-grey',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};

{
  /* <div className='flex justify-center gap-6 mt-7'>
        <div className='flex items-center gap-1.5 text-grey text-sm'>
          <div>
            <FaDiscord size={14} />
          </div>
          <div>richpepsi#0335</div>
        </div>
        <div className='flex items-center gap-1 text-grey text-sm'>
          <div>
            <AiOutlineTwitter size={14} />
          </div>
          <div>@richpepsi_</div>
        </div>
      </div> */
}
