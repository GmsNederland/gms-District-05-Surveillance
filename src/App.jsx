import { Toaster } from "@/components/ui/toaster"
import { QueryClientProvider } from '@tanstack/react-query'
import { queryClientInstance } from '@/lib/query-client'
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import PageNotFound from './lib/PageNotFound';
import { AuthProvider, useAuth } from '@/lib/AuthContext';
import UserNotRegisteredError from '@/components/UserNotRegisteredError';
import { AppStateProvider } from '@/lib/appState.jsx';

// Page imports
import EntryRedirect from '@/pages/EntryRedirect';
import RoleSelect from '@/pages/RoleSelect';
import PanelRouter from '@/pages/PanelRouter';
import Layout from '@/components/Layout';

const AuthenticatedApp = () => {
  const { isLoadingAuth, isLoadingPublicSettings, authError, navigateToLogin } = useAuth();

  if (isLoadingPublicSettings || isLoadingAuth) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-background">
        <div className="text-center">
          <div className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mx-auto mb-3"></div>
          <p className="text-xs font-mono text-muted-foreground tracking-wider uppercase">D05-GMS Laden...</p>
        </div>
      </div>
    );
  }

  if (authError) {
    if (authError.type === 'user_not_registered') {
      return <UserNotRegisteredError />;
    } else if (authError.type === 'auth_required') {
      navigateToLogin();
      return null;
    }
  }

  return (
    <AppStateProvider>
      <Routes>
        <Route path="/" element={<EntryRedirect />} />
        <Route path="/roles" element={<RoleSelect />} />
        <Route element={<Layout />}>
          <Route path="/panel/:service" element={<PanelRouter />} />
        </Route>
        <Route path="*" element={<PageNotFound />} />
      </Routes>
    </AppStateProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <QueryClientProvider client={queryClientInstance}>
        <Router>
          <AuthenticatedApp />
        </Router>
        <Toaster />
      </QueryClientProvider>
    </AuthProvider>
  )
}

export default App