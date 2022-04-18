import Image from 'next/image';
import Link from 'next/link';

import { Community } from '_types/Community';

type CommunityCardProps = {
  community: Community;
  walletGroupID: string;
};

const CommunityCard = (props: CommunityCardProps) => {
  let button =
    'relative flex flex-col items-center px-8 py-8 border-4 rounded-lg bg-backgroundDark h-72 border-backgroundDark hover:border-primaryDark';
  button += props.community.isOwnedByUser ? '' : ' pointer-events-none';
  return (
    <Link href={`community/${props.community.id}`}>
      <button className={button}>
        <div className={props.community.isOwnedByUser ? 'h-full w-full grayscale-0' : 'h-full w-full grayscale'}>
          <div
            className={`h-24 w-full flex flex-col-reverse justify-center text-primary font-bold break-words uppercase leading-relaxed text-lg`}
          >
            {props.community.name}
          </div>
          <div className='relative flex flex-col w-full px-5 grow'>
            <div className='relative flex justify-center overflow-hidden border-4 rounded-full aspect-square border-primary'>
              <Image
                src={props.community.image}
                layout='fill'
                placeholder={'blur'}
                blurDataURL={props.community.image}
                unoptimized={true}
              />
            </div>
          </div>
        </div>
      </button>
    </Link>
  );
};

export default CommunityCard;
