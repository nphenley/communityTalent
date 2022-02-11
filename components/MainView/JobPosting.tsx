const JobPosting = () => (
  <div className='absolute left-0 right-0 z-40 w-3/4 mx-auto bg-gray-700 rounded shadow-lg top-14 opacity-95 h-1/2'>
    <form className='px-6 py-8 '>
      <div className='flex flex-col items-center mb-8'>
        <label
          htmlFor='title'
          className='block mb-1 text-lg font-medium text-gray-300'
        >
          Title
        </label>
        <input className='block w-1/2 p-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg sm:text-xs focus:ring-blue-500 focus:border-blue-500'></input>
      </div>
      <div className='flex flex-col items-center mb-8 '>
        <label
          htmlFor='description'
          className='block mb-1 text-lg font-medium text-gray-300'
        >
          Description
        </label>
        <textarea className='block w-full h-64 p-2 text-lg text-white placeholder-gray-400 align-text-top bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500'></textarea>
      </div>
      <div className='flex flex-col items-center'>
        <label
          htmlFor='tags'
          className='block mb-2 text-lg font-medium text-gray-300'
        >
          Tags
        </label>
        <div className='flex items-center mb-14'>
          <div className=''>
            <span className='inline-block px-2 py-1 mr-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full last:mr-0'>
              Art
            </span>
            <span className='inline-block px-2 py-1 mr-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full last:mr-0'>
              Marketing
            </span>
            <span className='inline-block px-2 py-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full last:mr-0'>
              Dev
            </span>
          </div>
        </div>
      </div>
      <div className='flex flex-col items-center '>
        <button className='px-4 py-2 font-bold bg-gray-900 border-b-4 border-gray-800 rounded text-md'>
          Add
        </button>
      </div>
    </form>
  </div>
);

export default JobPosting;
