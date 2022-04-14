import { Project } from '_types/Project';
import { GiPlainCircle } from 'react-icons/gi';

type ExpandedProjectCardProps = {
  project: Project;
};

const ExpandedProjectCard = (props: ExpandedProjectCardProps) => {
  const ruler = <hr className='border-primaryDark border-2' />;

  return (
    <div className={styles.container} onClick={(e) => e.stopPropagation()}>
      <div className='flex flex-col w-[80%] gap-y-6'>
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

      {props.project.skills && props.project.skills.length ? (
        <>
          {ruler}

          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeading}>Skills</div>
            <div className={styles.sectionBulletpoints}>
              {props.project.skills.map((skill) => (
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

      {props.project.description ? (
        <>
          {ruler}

          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeading}>Experience</div>
            <div className={styles.sectionParagraph}>{props.project.description.replace('<br/>', '\n')}</div>
          </div>
        </>
      ) : null}

      {props.project.languages && props.project.languages.length ? (
        <>
          {ruler}

          <div className={styles.sectionContainer}>
            <div className={styles.sectionHeading}>Languages</div>
            <div className='flex flex-wrap gap-2'>
              {props.project.languages.map((language) => (
                <div key={language} className={styles.sectionTags}>
                  {language}
                </div>
              ))}
            </div>
          </div>
        </>
      ) : null}
    </div>
  );
};

export default ExpandedProjectCard;

const styles = {
  container:
    'relative w-full bg-backgroundDark rounded-lg shadow-lg py-11 flex flex-col items-center gap-6 overflow-y-scroll h-[90%]',
  imageContainer: 'rounded-full overflow-hidden flex justify-center',
  sectionContainer: 'px-5 py-5 gap-5 flex flex-col',
  sectionHeading: 'text-primary font-bold',
  sectionParagraph: 'whitespace-pre-wrap text-grey',
  sectionBulletpoints: 'gap-1 flex flex-col px-2 break-words text-grey',
  sectionTags: 'bg-primaryDark py-1.5 px-3 rounded-lg',
};
