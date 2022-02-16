import { useRouter } from 'next/router';
import { communityId } from 'hardcoded';

const Communities = () => {
  const router = useRouter();

  return (
    <div className='p-12 flex flex-wrap gap-12'>
      <button
        className='rounded-full text-white bg-cyan-900 h-44 w-44 hover:bg-cyan-500'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>
      <button
        className='rounded-full text-white bg-cyan-900 h-44 w-44 hover:bg-cyan-500'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>
      <button
        className='rounded-full text-white bg-cyan-900 h-44 w-44 hover:bg-cyan-500'
        onClick={() => router.push(`/community/${communityId}`)}
      >
        Test Community
      </button>
    </div>
  );
};

export default Communities;
