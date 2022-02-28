import { useState } from 'react';
import { FaThumbtack, FaSkull } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';
import EditProjectForm from './EditProjectForm';

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
      <div className='grid grid-cols-3 px-8 '>
        <div className='col-span-2'>{props.project.title}</div>

        <div className='col-span-1 ml-8'>
          <div className='flex'>
            <EmoteIcon
              onClick={() => props.togglePinned(props.project.id)}
              active={props.isUserPinned}
              number={props.project.numberOfPins}
              icon={<FaThumbtack size={12} />}
            />
            <EmoteIcon number={0} active={false} icon={<FaSkull size={12} />} />
          </div>
        </div>
        <div className={styles.sectionContainer}>
          <div className='w-20 text-sm text-grey'>
            {props.project.authorDisplayNames}
          </div>
        </div>
      </div>

      <div className='flex flex-col w-9/12 gap-4 mx-auto '>
        {ruler}
        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>
            {props.project.description.replace('<br/>', '\n')}
          </div>
        </div>

        {props.project.tags && props.project.tags.length ? (
          <>
            {ruler}

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
      <div className='absolute bottom-0 right-0 p-1.5'>
        {props.project.dateCreated.toDate().toDateString().substring(4)}
      </div>

      {postedByUser ? (
        <button
          onClick={() => props.setEditProject(!props.editProject)}
          className='absolute bottom-0 left-0 p-1.5'
        >
          Edit
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
  'relative bg-backgroundDark rounded-lg shadow-lg w-full py-4 flex flex-col gap-3 overflow-y-scroll mx-auto';

const ruler = <hr className='border-primary'></hr>;

const styles = {
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pb-1 gap-2 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
