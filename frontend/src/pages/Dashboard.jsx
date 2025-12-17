import { Link } from 'react-router-dom';
import { FaBoxes, FaSearch, FaPlusCircle } from 'react-icons/fa'; 
function Dashboard() {
  return (
    <div className="container mx-auto px-6 py-16 min-h-screen bg-slate-900"> 
      
      <h1 className="text-5xl font-extrabold text-white mb-16 text-center tracking-tighter">
        <span className="text-amber-500">ADMIN </span>
        DASHBOARD
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-10">
        
        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.03] transition duration-300 border-t-8 border-amber-500 flex flex-col items-start">
          <FaBoxes className="text-4xl text-amber-500 mb-4" />
          <h2 className="text-3xl font-bold mb-3 text-slate-900">Found Items</h2>
          <p className="text-gray-600 mb-8 flex-grow">Manage items that have been found, verified, and reported by users.</p>
          
          <Link 
            to="/found"
            className="w-full text-center bg-amber-500 text-slate-900 font-bold px-6 py-3 rounded-xl hover:bg-amber-600 transition-colors shadow-lg mt-auto"
          >
            View Found Items
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.03] transition duration-300 border-t-8 border-slate-900 flex flex-col items-start">
          <FaSearch className="text-4xl text-slate-900 mb-4" />
          <h2 className="text-3xl font-bold mb-3 text-slate-900">Lost Items</h2>
          <p className="text-gray-600 mb-8 flex-grow">View, track, and manage reported items that are currently lost.</p>
          
          <Link 
            to="/lost"
            className="w-full text-center bg-slate-900 text-white font-bold px-6 py-3 rounded-xl hover:bg-slate-800 transition-colors shadow-lg mt-auto"
          >
            View Lost Items
          </Link>
        </div>

        <div className="bg-white rounded-2xl shadow-2xl p-8 transform hover:scale-[1.03] transition duration-300 border-t-8 border-red-600 flex flex-col items-start">
          <FaPlusCircle className="text-4xl text-red-600 mb-4" />
          <h2 className="text-3xl font-bold mb-3 text-slate-900">Quick Report</h2>
          <p className="text-gray-600 mb-8 flex-grow">Quickly report a new found or lost item directly.</p>
          
          <div className="flex space-x-4 w-full mt-auto">
            <Link 
              to="/report/found"
              className="flex-1 text-center bg-amber-500 text-slate-900 font-semibold px-4 py-2.5 rounded-lg hover:bg-amber-600 transition-colors shadow-md text-sm"
            >
              Report Found
            </Link>
            <Link 
              to="/report/lost"
              className="flex-1 text-center bg-slate-900 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-slate-800 transition-colors text-sm shadow-md"
            >
              Report Lost
            </Link>
          </div>
        </div>
      </div>

      <div className="mt-20">
        <h2 className="text-4xl font-bold text-amber-500 mb-8 border-b-2 border-slate-700 pb-2">Recent Activity</h2>
        
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <p className="text-gray-600 italic">No recent activities available. Check back soon!</p>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;