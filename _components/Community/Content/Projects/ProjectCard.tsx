import { useContext, useEffect, useState } from 'react';
import { FaThumbtack, FaSkull, FaCaretDown, FaPen, FaArrowUp, FaArrowDown, FaCaretUp } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';
import EditProjectForm from './EditProjectForm';
import moment from 'moment';
import { getUserVote, toggleProjectUpvote } from '_api/projects';
import { CommunityContext } from '_contexts/CommunityContext';
type ProjectCardProps = {
  project: Project;
  walletGroupID: string;
};

const ProjectCard = (props: ProjectCardProps) => {
  const [editProject, setEditProject] = useState(false);
  const [project, setProject] = useState(props.project);
  const [userVote, setUserVote] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);

  const communityId = useContext(CommunityContext);

  useEffect(() => {
    if (!project) return;
    getUserVote(project.id, props.walletGroupID, setUserVote);
  }, [project]);
  // Note:
  // Technically shouldn't use toLowerCase() here, instead use checksum converter or whatever.
  const postedByUser = project.walletGroupID.toLowerCase() === props.walletGroupID.toLowerCase();
  let containerClassName =
    'relative bg-backgroundDark rounded-lg shadow-lg w-full py-4 flex gap-3 overflow-y-scroll mx-auto';
  containerClassName += isExpanded ? ' max-h-[400px] min-h-[250px]' : '';

  const expandButton = (
    <button
      onClick={() => {
        setIsExpanded(!isExpanded);
      }}
      className='absolute right-5 bottom-4'
    >
      {!isExpanded ? <FaCaretDown size={26} /> : <FaCaretUp size={26} />}
    </button>
  );

  return (
    <div className={containerClassName}>
      {!isExpanded ? (
        <div className='grid w-full grid-rows-2 px-3'>
          <div className='flex row-span-2'>
            <div className='flex col-span-1 row-span-2 pr-1.5'>
              <div className='flex items-center'>
                <EmoteIcon
                  onClick={() =>
                    toggleProjectUpvote(
                      communityId,
                      project.id,
                      project.walletGroupID,
                      userVote,
                      setProject,
                      setUserVote
                    )
                  }
                  active={userVote}
                  number={project.votes ? project.votes : 0}
                  icon={<FaArrowUp size={12} />}
                />
              </div>
            </div>

            <div className='row-span-2 '>
              <div className='flex flex-row '>
                <div className='flex-row'>
                  <div className='w-full'>{project.title}</div>
                  <div className='text-sm text-grey'>{project.walletGroupID}</div>
                </div>
              </div>

              <div className='pt-2'>
                {project.tags && project.tags.length ? (
                  <>
                    <div className={styles.sectionContainer}>
                      <div className='flex flex-wrap gap-2'>
                        {project.tags.map((tag) => (
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
          </div>

          <div className='absolute text-sm right-4 top-6 text-grey'>
            {moment(project.dateCreated.toDate()).fromNow()}
          </div>

          {expandButton}
        </div>
      ) : (
        <div className='grid w-full grid-rows-3 px-3 '>
          <div className='flex row-span-3'>
            <div className='flex col-span-1 row-span-3 pr-1.5'>
              <div className='my-auto'>
                <EmoteIcon
                  onClick={() =>
                    toggleProjectUpvote(
                      communityId,
                      project.id,
                      project.walletGroupID,
                      userVote,
                      setProject,
                      setUserVote
                    )
                  }
                  active={userVote}
                  number={project.votes ? project.votes : 0}
                  icon={<FaArrowUp size={12} />}
                />
                <EmoteIcon number={0} active={false} icon={<FaArrowDown size={12} />} />
              </div>
            </div>

            <div className='col-span-19'>
              <div className='flex-row mb-5'>
                <div className='w-full'>{project.title}</div>
                <div className='text-sm text-grey'>{project.walletGroupID}</div>
              </div>

              <div className='break-all col-span-19'>{project.description}</div>

              <div className='flex pt-2 '>
                {project.tags && project.tags.length ? (
                  <>
                    <div className={styles.sectionContainer}>
                      <div className='flex flex-wrap gap-2'>
                        {project.tags.map((tag) => (
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
          </div>

          <div className='absolute text-sm right-4 top-6 text-grey'>
            {moment(project.dateCreated.toDate()).fromNow()}
          </div>

          {expandButton}
        </div>
      )}

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
          project={project}
          setEditProject={setEditProject}
          setProject={setProject}
        />
      ) : null}
    </div>
  );
};

export default ProjectCard;

const styles = {
  sectionContainer: 'pb-1 gap-2 flex flex-col',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
