import { QueryClient, QueryClientProvider } from 'node_modules/@tanstack/react-query/build/legacy';
import './App.css'
import AppRoutes from './AppRoutes'
import { Toaster } from 'sonner';

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
