import Image from 'next/image';
import Link from 'next/link';

import { Community } from '_types/Community';

type CommunityCardProps = {
  community: Community;
  walletGroupID: string;
};

const CommunityCard = (props: CommunityCardProps) => {
  let button =
    'py-12 relative flex flex-col items-center justify-center border-4 rounded-lg bg-backgroundDark border-backgroundDark hover:border-primaryDark';
  button += props.community.isOwnedByUser ? '' : ' pointer-events-none';
  return (
    <Link href={`community/${props.community.id}`}>
      <button className={button}>
        <div className={props.community.isOwnedByUser ? 'w-[75%] grayscale-0' : 'w-[75%] grayscale'}>
          <div
            className={`-mt-2 mb-2 h-24 flex flex-col-reverse justify-center text-primary font-bold break-words uppercase leading-relaxed text-lg`}
          >
            {props.community.name}
          </div>
          <div className='relative flex flex-col w-[65%] md:w-[75%] mx-auto grow'>
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
