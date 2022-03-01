import { useState } from 'react';
import { FaThumbtack, FaSkull, FaCaretDown, FaPen } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';
import EditProjectForm from './EditProjectForm';
import moment from 'moment';
type ProjectCardProps = {
  project: Project;
  walletAddress: string;
  isUserPinned: boolean;
  togglePinned: any;
  editProject: boolean;
  setEditProject: any;
};

const ProjectCard = (props: ProjectCardProps) => {
  const postedByUser =
    props.project.authorAddresses[0].toLowerCase() ===
    props.walletAddress.toLowerCase();

  return (
    <div className={containerClassName}>
      <div className='grid w-full grid-cols-10 grid-rows-2 px-4 '>
        <div className='flex flex-row col-span-10 row-span-1 '>
          <div className='col-span-2'>
            <EmoteIcon
              onClick={() => props.togglePinned(props.project.id)}
              active={props.isUserPinned}
              number={props.project.numberOfPins}
              icon={<FaThumbtack size={12} />}
            />
          </div>
          <div className='w-full pl-3'>
            <div className='col-span-6 '>{props.project.title}</div>
            <div className='flex flex-row '>
              <div className='text-sm text-grey'>
                {props.project.authorDisplayNames}
              </div>
              <div className='ml-auto mr-0 text-sm text-grey'>
                {moment(props.project.dateCreated.toDate()).fromNow()}
              </div>
            </div>
          </div>
        </div>

        <div className='flex flex-row col-span-10 row-span-1 pt-2'>
          <div className='col-span-2'></div>
          <EmoteIcon number={0} active={false} icon={<FaSkull size={12} />} />
          <div className='col-span-6'>
            {props.project.tags && props.project.tags.length ? (
              <>
                <div className={styles.sectionContainer}>
                  <div className='flex flex-wrap gap-2'>
                    {props.project.tags.map((tag) => (
                      <div key={tag} className={styles.sectionTags}>
                        {tag}
                      </div>
                    ))}
                  </div>
                </div>
              </>
            ) : null}
          </div>
          <div className='absolute right-5 bottom-4'>
            <FaCaretDown size={26} />
          </div>
        </div>
      </div>

      {postedByUser ? (
        <button
          onClick={() => {
            props.setEditProject(!props.editProject);
          }}
          className='absolute top-2 right-0 p-0.5'
        >
          <FaPen size={12} />
        </button>
      ) : null}

      {props.editProject ? (
        <EditProjectForm
          project={props.project}
          setEditProject={props.setEditProject}
        />
      ) : null}
    </div>
  );
};

export default ProjectCard;

let containerClassName =
  'relative bg-backgroundDark rounded-lg shadow-lg w-full py-4 flex gap-3 overflow-y-scroll mx-auto';

const ruler = <hr className='border-primary'></hr>;

const styles = {
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pb-1 gap-2 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};

{
  /* <div className='flex flex-col w-9/12 gap-4 mx-auto '>
        {ruler}
        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>
            {props.project.description.replace('<br/>', '\n')}
          </div>
        </div>

        
      </div> */
}

{
  /*  */
}
