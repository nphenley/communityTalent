import Image from 'next/image';
import Link from 'next/link';

import { Community } from '_types/Community';

type CommunityCardProps = {
  community: Community;
  walletGroupID: string;
};

const CommunityCard = (props: CommunityCardProps) => {
  const className = `select-none relative bg-backgroundDark p-4 py-8 rounded-lg h-72 flex flex-col items-center ${
    props.community.isOwnedByUser ? 'grayscale-0' : 'grayscale'
  }`;

  return (
    <Link href={`community/${props.community.id}`}>
      <button className={className}>
        <div className={`h-12 px-2 w-full flex flex-col-reverse justify-center text-primary font-bold break-words`}>
          {props.community.name}
        </div>
        <div className='flex flex-col justify-center px-6 relative grow w-full'>
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
      </button>
    </Link>
  );
};

export default CommunityCard;
