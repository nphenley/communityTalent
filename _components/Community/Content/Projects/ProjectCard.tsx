import { useContext, useEffect, useState } from 'react';
import { FaThumbtack, FaSkull, FaCaretDown, FaPen, FaArrowUp, FaArrowDown, FaCaretUp, FaBan } from 'react-icons/fa';
import EmoteIcon from '_components/Community/SideBar/EmoteIcon';
import { Project } from '_types/Project';
import EditProjectForm from './EditProjectForm';
import moment from 'moment';
import { deleteProject, getUserVote, toggleProjectUpvote } from '_api/projects';
import { CommunityContext } from '_contexts/CommunityContext';
type ProjectCardProps = {
  project: Project;
  walletGroupID: string;
  admin: boolean | undefined;
  setProjects: any;
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
    'relative bg-backgroundDark rounded-lg shadow-lg w-full py-3 flex gap-3 overflow-y-scroll mx-auto';
  containerClassName += isExpanded ? ' max-h-[400px] min-h-[150px]' : '';

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
        <div className='flex-row w-full px-3'>
          <div className='flex h-full'>
            <div className='flex items-center pr-2'>
              <EmoteIcon
                onClick={() =>
                  toggleProjectUpvote(communityId, project.id, project.walletGroupID, userVote, setProject, setUserVote)
                }
                active={userVote}
                number={project.votes ? project.votes : 0}
                icon={<FaArrowUp size={12} />}
              />
            </div>

            <div className='flex-col gap-2 grow'>
              <div>
                <div>{project.title}</div>
                <div className='flex justify-between text-sm text-grey'>
                  <div>{project.displayName}</div>
                  <div>{moment(project.dateCreated.toDate()).fromNow()}</div>
                </div>
              </div>

              <div className='pt-2 '>
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
        </div>
      ) : (
        <div className='flex-row w-full px-3'>
          <div className='flex h-full'>
            <div className='flex items-center pr-2'>
              <EmoteIcon
                onClick={() =>
                  toggleProjectUpvote(communityId, project.id, project.walletGroupID, userVote, setProject, setUserVote)
                }
                active={userVote}
                number={project.votes ? project.votes : 0}
                icon={<FaArrowUp size={12} />}
              />
            </div>

            <div className='grow'>
              <div className='flex flex-col gap-3'>
                <div>
                  <div>{project.title}</div>
                  <div className='flex justify-between text-sm text-grey'>
                    <div>{project.displayName}</div>
                    <div>{moment(project.dateCreated.toDate()).fromNow()}</div>
                  </div>
                </div>

                <div className='break-all'>{project.description}</div>

                <div className='flex'>
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
          </div>
        </div>
      )}

      {props.admin ? (
        <button
          className='absolute top-2 right-5 p-0.5'
          onClick={() => deleteProject(communityId, project.id, props.setProjects)}
        >
          <FaBan size={12} />
        </button>
      ) : null}
      {expandButton}

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
