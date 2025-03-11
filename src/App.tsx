import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { ReactQueryDevtools } from "@tanstack/react-query-devtools"
import Layout from "./components/layout/Layout"
import HomePage from "./pages/HomePage"
import PetDetailPage from "./pages/PetDetailPage"
import AddPetPage from "./pages/AddPetPage"
import EditPetPage from "./pages/EditPetPage"
import AddCareInstructionPage from "./pages/AddCareInstructionPage"
import AddEmergencyContactPage from "./pages/AddEmergencyContactPage"
import EditEmergencyContactPage from "./pages/EditEmergencyContactPage"
import AddCaretakerPage from "./pages/AddCaretakerPage"
import SharedPetViewPage from "./pages/SharedPetViewPage"
import OfflineNotification from "./components/ui/OfflineNotification"
import "./styles/animations.css"

// Create a client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutes
      refetchOnWindowFocus: false,
      retry: (failureCount, error: Error) => {
        // Don't retry if we're offline
        if (
          error?.message?.includes("Failed to fetch") ||
          error?.message?.includes("NetworkError") ||
          !navigator.onLine
        ) {
          return false
        }
        return failureCount < 3
      },
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Layout />}>
            <Route index element={<HomePage />} />
            <Route path="pets/:id" element={<PetDetailPage />} />
            <Route path="add-pet" element={<AddPetPage />} />
            <Route path="pets/:id/edit" element={<EditPetPage />} />
            <Route
              path="pets/:petId/care/add"
              element={<AddCareInstructionPage />}
            />
            <Route
              path="pets/:petId/emergency/add"
              element={<AddEmergencyContactPage />}
            />
            <Route
              path="pets/:petId/emergency/:contactId/edit"
              element={<EditEmergencyContactPage />}
            />
            <Route
              path="pets/:petId/caretakers/add"
              element={<AddCaretakerPage />}
            />
          </Route>
          <Route path="/shared/pet/:id" element={<SharedPetViewPage />} />
        </Routes>
        <OfflineNotification />
      </BrowserRouter>
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  )
}

export default App
