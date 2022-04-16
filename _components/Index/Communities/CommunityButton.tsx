import Image from 'next/image';
import Link from 'next/link';
import { Community } from '_types/Community';

type CommunityButtonProps = {
  community: Community;
  walletGroupID: string;
};

const CommunityButton = (props: CommunityButtonProps) => {
  return (
    <div className={styles.container}>
      <Link href={`community/${props.community.id}`}>
        <button className='flex flex-col items-center mx-auto space-y-4'>
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
          <div className='font-bold break-all text-primary'>{props.community.name}</div>
        </button>
      </Link>
    </div>
  );
};

export default CommunityButton;

const styles = {
  container: 'relative',
  togglePinButtonContainer: 'absolute top-0 right-0 bg-primaryDark hover:bg-primary p-2 rounded-lg',
};
