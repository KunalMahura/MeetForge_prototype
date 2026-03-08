import React from 'react';
import { UserButton } from '@clerk/clerk-react';
import { useNavigate } from 'react-router-dom';
import { Video } from 'lucide-react';

export default function Dashboard() {
  const navigate = useNavigate();

  const handleCreateRoom = () => {
    // Basic logic to generate a unique room ID
    const roomId = Math.random().toString(36).substring(2, 12);
    navigate(`/interview/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <header className="flex justify-between items-center p-6 bg-white shadow-sm">
        <h1 className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          MeetForge
        </h1>
        <UserButton afterSignOutUrl="/" />
      </header>

      <main className="flex-1 max-w-7xl w-full mx-auto p-8">
        <section className="bg-white rounded-2xl shadow-sm border border-gray-100 p-8 text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-extrabold text-gray-900 mb-4">Welcome to your Dashboard</h2>
          <p className="text-gray-500 mb-8">
            Create a new 1-on-1 interview session or view your past interviews below.
          </p>
          
          <button
            onClick={handleCreateRoom}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-md hover:shadow-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <Video className="w-5 h-5 mr-2" />
            Start New Interview
          </button>
        </section>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 gap-8">
          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Upcoming Sessions</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-500 italic text-sm">No upcoming sessions right now.</p>
            </div>
          </section>

          <section>
            <h3 className="text-xl font-bold text-gray-900 mb-4">Past Interviews</h3>
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <p className="text-gray-500 italic text-sm">You have not completed any interviews yet.</p>
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
