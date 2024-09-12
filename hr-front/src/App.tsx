import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { Navigation } from "./navigation/navigation";
import { ThemeProvider } from "./components/theme-provider/theme-provider";
import { Toaster } from "@/components/ui/toaster";

const queryClient = new QueryClient();

function App() {
  return (
    <ThemeProvider>
      <QueryClientProvider client={queryClient}>
        <Navigation />
        <Toaster />
      </QueryClientProvider>
    </ThemeProvider>
  );
}

export default App;
