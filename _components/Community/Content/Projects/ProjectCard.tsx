import { Project } from '_types/Project';
import { AiFillTool } from 'react-icons/ai';

type ProjectCardProps = {
  project: Project;
};

const ProjectCard = (props: ProjectCardProps) => {
  const ruler = <hr className='border-primaryDark border-2' />;

  return (
    <div className={styles.container}>
      {props.project.isAdminProject && (
        <div className='absolute top-3 left-3 flex flex-row items-center gap-1 text-primary'>
          <AiFillTool size={20} />
        </div>
      )}

      <div className='flex flex-col w-[80%] gap-y-6'>
        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>{props.project.role}</div>
        </div>

        {ruler}

        <div className={styles.sectionContainer}>
          <div className={styles.sectionParagraph}>{props.project.description.replace('<br/>', '\n')}</div>
        </div>

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
      </div>
    </div>
  );
};

export default ProjectCard;

const styles = {
  container: 'relative bg-backgroundDark rounded-lg shadow-lg py-11 flex flex-col items-center gap-6 h-full',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 pt-3 pb-3 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap text-grey',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words text-grey',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
