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
      <button className='select-none relative bg-backgroundDark px-8 py-8 rounded-lg h-72 flex flex-col items-center border-4 border-backgroundDark hover:border-primaryDark'>
        <div className={props.community.isOwnedByUser ? 'h-full w-full grayscale-0' : 'h-full w-full grayscale'}>
          <div
            className={`h-24 w-full flex flex-col-reverse justify-center text-primary font-bold break-words uppercase leading-relaxed text-lg`}
          >
            {props.community.name}
          </div>
          <div className='flex flex-col px-5 relative grow w-full'>
            <div className='flex justify-center overflow-hidden rounded-full relative aspect-square border-4 border-primary'>
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
