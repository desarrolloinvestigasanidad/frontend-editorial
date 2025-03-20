export default function Loading() {
  return (
    <div className='flex items-center justify-center h-64'>
      <div className='relative'>
        <div className='h-16 w-16 rounded-full border-t-4 border-b-4 border-purple-500 animate-spin'></div>
        <div className='absolute inset-0 flex items-center justify-center'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='24'
            height='24'
            viewBox='0 0 24 24'
            fill='none'
            stroke='currentColor'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
            className='h-6 w-6 text-purple-500'>
            {/* Dashboard icon */}
            <rect x='3' y='3' width='7' height='7'></rect>
            <rect x='14' y='3' width='7' height='7'></rect>
            <rect x='14' y='14' width='7' height='7'></rect>
            <rect x='3' y='14' width='7' height='7'></rect>
          </svg>
        </div>
      </div>
    </div>
  );
}
