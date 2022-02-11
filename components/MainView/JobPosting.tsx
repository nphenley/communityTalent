import { Timestamp, doc, setDoc } from 'firebase/firestore';
import { db } from '_firebase/config';
import 'firebase/firestore';
const JobPosting = () => {
  const jobPost = (event) => {
    event.preventDefault();
    const elementsArray = [...event.target.elements];
    const formData = elementsArray.reduce((accumulator, currentValue) => {
      if (currentValue.id || currentValue.checked) {
        accumulator[currentValue.id] = currentValue.value;
      }

      return accumulator;
    }, {});
    setDoc(doc(db, 'jobs', 'othertest'), {
      dateCreated: Timestamp.now(),
      title: formData.title,
      description: formData.description,
      user: 'testuser2',
      tags: [false, true, false],
    });
  };

  return (
    <div className='absolute left-0 right-0 z-40 w-3/4 mx-auto bg-gray-700 rounded shadow-lg h-3/5 top-14 opacity-95'>
      <form onSubmit={jobPost} className='px-6 py-8 '>
        <div className='flex flex-col items-center mb-8'>
          <label className='block mb-1 text-lg font-medium text-gray-300'>
            Title
          </label>
          <input
            id='title'
            className='block w-1/2 p-2 text-white placeholder-gray-400 bg-gray-700 border border-gray-600 rounded-lg sm:text-xs focus:ring-blue-500 focus:border-blue-500'
          ></input>
        </div>
        <div className='flex flex-col items-center mb-8 '>
          <label className='block mb-1 text-lg font-medium text-gray-300'>
            Description
          </label>
          <textarea
            id='description'
            className='block w-full h-64 p-2 text-lg text-white placeholder-gray-400 align-text-top bg-gray-700 border border-gray-600 rounded-lg focus:ring-blue-500 focus:border-blue-500'
          ></textarea>
        </div>
        <div className='flex flex-col items-center'>
          <label className='block mb-2 text-lg font-medium text-gray-300'>
            Tags
          </label>
          <div className='flex items-center mb-14'>
            <div className=''>
              <input type='checkbox'></input>
              <label className='inline-block px-2 py-1 mr-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full checked:bg-black last:mr-0'>
                Art
              </label>

              <input type='checkbox'></input>
              <label className='inline-block px-2 py-1 mr-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full last:mr-0'>
                Marketing
              </label>
              <input type='checkbox'></input>

              <label className='inline-block px-2 py-1 text-sm font-semibold text-white uppercase bg-gray-900 rounded-full last:mr-0'>
                Dev
              </label>
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
};
export default JobPosting;
