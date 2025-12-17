import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-stone-50 py-12 px-4 sm:px-6 lg:px-8">
      
      <div className="text-center p-10 bg-white rounded-xl shadow-xl border border-gray-100">
        <p className="text-9xl font-extrabold text-amber-500 opacity-70 mb-4">404</p> 
        
        <h1 className="text-4xl font-extrabold text-stone-700 mb-4">
          Page Not Found
        </h1>
        
        <p className="text-lg text-gray-600 mb-8">
          The page you're looking for doesn't exist or has been moved.
        </p>
        
        <Link 
          to="/" 
          className="px-8 py-3 bg-amber-500 text-stone-800 font-semibold rounded-lg hover:bg-amber-600 transition-colors shadow-md"
        >
          Go to Home
        </Link>
      </div>
      
    </div>
  );
}

export default NotFound;