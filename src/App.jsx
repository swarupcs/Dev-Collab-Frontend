import './App.css'
import AppRoutes from './AppRoutes'
import { Toaster } from 'sonner';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
function App() {

   const queryClient = new QueryClient();


  return (
    <>
      <QueryClientProvider client={queryClient}>
        <AppRoutes />
        <Toaster position='top-center' richColors />
      </QueryClientProvider>
    </>
  );
}

export default App
