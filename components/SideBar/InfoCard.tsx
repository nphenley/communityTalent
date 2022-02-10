const InfoCard = ({ user }) => (
  <div className='overflow-hidden bg-gray-900 rounded shadow-lg'>
    <div className='px-6 py-4'>
      <div className='text-xl font-bold'>{user}</div>
      <p className='text-base text-gray-500'>
        -Lorem ipsum dolor sit amet, consectetur adipisicing elit. -Voluptatibus
        quia, nulla! Maiores et perferendis eaque, exercitationem praesentium
        nihil.
      </p>
    </div>
    <div className='px-6 pt-4 pb-2'>
      <span className='inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full'>
        Dev
      </span>
      <span className='inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full'>
        Nextjs
      </span>
      <span className='inline-block px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full'>
        Tailwind
      </span>
    </div>
  </div>
);

export default InfoCard;
