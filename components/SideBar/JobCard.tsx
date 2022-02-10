const JobCard = ({ title, description, tags, user }) => (
  <div className='relative overflow-hidden bg-gray-900 rounded shadow-lg h-72'>
    <div className='px-6 py-4'>
      <div className='text-xl font-bold'>{title}</div>
      <p className='text-sm'>{user}</p>
      <p className='text-base text-gray-500'>{description}</p>
    </div>
    <div className='px-6 pt-4 pb-2'>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[0] === true ? 'block' : 'hidden'
        }`}
      >
        Dev
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[1] === true ? 'block' : 'hidden'
        }`}
      >
        Marketing
      </span>
      <span
        className={`absolute bottom-3 px-3 py-1 mb-2 mr-2 text-sm font-semibold text-gray-700 bg-gray-200 rounded-full ${
          tags[2] === true ? 'block' : 'hidden'
        }`}
      >
        Art
      </span>
    </div>
  </div>
);

export default JobCard;
