import Image from 'next/image';
import Link from 'next/link';
import { Community } from '_types/Community';

type CommunityCardProps = {
  community: Community;
  walletGroupID: string;
};

const CommunityCard = (props: CommunityCardProps) => {
  return (
    <Link href={`community/${props.community.id}`}>
      <div className={styles.container}>
        <button
          className={`flex flex-col items-center gap-y-8 ${
            props.community.isOwnedByUser ? 'grayscale-0' : 'grayscale'
          }`}
        >
          <div className={`text-primary font-bold break-all `}>{props.community.name}</div>
          <div className='flex justify-center overflow-hidden rounded-full'>
            <Image
              src={props.community.image}
              height={150}
              width={150}
              placeholder={'blur'}
              blurDataURL={props.community.image}
              unoptimized={true}
            />
          </div>
        </button>
      </div>
    </Link>
  );
};

export default CommunityCard;

const styles = {
  container: 'bg-backgroundDark pt-6 px-8 pb-8 rounded-lg',
};
