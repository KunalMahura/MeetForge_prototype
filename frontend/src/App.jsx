import { Routes, Route } from 'react-router-dom';
import { ClerkProvider, SignedIn, SignedOut, RedirectToSignIn } from '@clerk/clerk-react';
import Dashboard from './pages/Dashboard';
import InterviewRoom from './pages/InterviewRoom';

const clerkPubKey = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY;

if (!clerkPubKey) {
  console.warn("Missing Clerk Publishable Key in .env.local");
}

function App() {
  return (
    <ClerkProvider publishableKey={clerkPubKey || "pk_test_sample"}>
      <Routes>
        {/* Public/Auth Routes */}
        <Route
          path="/"
          element={
            <>
              <SignedIn>
                <Dashboard />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />

        {/* Protected Routes */}
        <Route
          path="/interview/:roomId"
          element={
            <>
              <SignedIn>
                <InterviewRoom />
              </SignedIn>
              <SignedOut>
                <RedirectToSignIn />
              </SignedOut>
            </>
          }
        />
      </Routes>
    </ClerkProvider>
  );
}

export default App;
