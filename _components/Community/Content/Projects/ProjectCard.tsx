import { useState } from 'react';
import { FaThumbtack, FaSkull, FaCaretDown, FaPen } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';
import EditProjectForm from './EditProjectForm';
import moment from 'moment';
type ProjectCardProps = {
  project: Project;
  walletAddress: string;
};

const ProjectCard = (props: ProjectCardProps) => {
  const [editProject, setEditProject] = useState(false);

  const isUserPinned =
    props.project.votes &&
    props.project.votes.find(
      (obj) => obj.walletAddress === props.walletAddress && obj.type === 'up'
    )
      ? true
      : false;

  // Note:
  // Technically shouldn't use toLowerCase() here, instead use checksum converter or whatever.
  const postedByUser =
    props.project.walletAddress.toLowerCase() ===
    props.walletAddress.toLowerCase();

  return (
    <div className={styles.container}>
      <div className='grid w-full grid-cols-10 grid-rows-2 px-4 '>
        <div className='flex flex-row col-span-10 row-span-1 '>
          <div className='col-span-2'>
            <EmoteIcon
              onClick={() => console.log('pin project')}
              active={isUserPinned}
              number={props.project.votes ? props.project.votes.length : 0}
              icon={<FaThumbtack size={12} />}
            />
          </div>
          <div className='w-full pl-3'>
            <div className='col-span-6 '>{props.project.title}</div>
            <div className='flex flex-row '>
              <div className='text-sm text-grey'>
                {props.project.walletAddress}
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
            setEditProject(!editProject);
          }}
          className='absolute top-2 right-0 p-0.5'
        >
          <FaPen size={12} />
        </button>
      ) : null}

      {editProject ? (
        <EditProjectForm
          editProject={editProject}
          project={props.project}
          setEditProject={setEditProject}
        />
      ) : null}
    </div>
  );
};

export default ProjectCard;

const styles = {
  container:
    'relative bg-backgroundDark rounded-lg shadow-lg w-full py-4 flex gap-3 overflow-y-scroll mx-auto',
  sectionContainer: 'px-5 pb-1 gap-2 flex flex-col',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
