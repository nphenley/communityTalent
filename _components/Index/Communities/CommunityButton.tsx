import Image from 'next/image';
import Link from 'next/link';
import { AiFillPushpin, AiOutlineMinus } from 'react-icons/ai';
import { pinCommunity, unpinCommunity } from '_api/communities';
import { Community } from '_types/Community';

type CommunityButtonProps = {
  community: Community;
  pinningState: 'pin' | 'unpin' | 'none';
  walletGroupID: string;
};

const CommunityButton = (props: CommunityButtonProps) => {
  const togglePinButton = (
    <button
      className={styles.togglePinButtonContainer}
      onClick={() =>
        props.pinningState === 'pin'
          ? pinCommunity(props.walletGroupID, props.community.id)
          : unpinCommunity(props.walletGroupID, props.community.id)
      }
    >
      {props.pinningState === 'pin' ? <AiFillPushpin /> : <AiOutlineMinus />}
    </button>
  );

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

      {props.pinningState !== 'none' && togglePinButton}
    </div>
  );
};

export default CommunityButton;

const styles = {
  container: 'relative',
  togglePinButtonContainer: 'absolute top-0 right-0 bg-primaryDark hover:bg-primary p-2 rounded-lg',
};
