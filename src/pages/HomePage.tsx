import React from "react"
import { Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { fetchPets } from "../api"
import PetCard from "../components/pets/PetCard"
import { Button } from "../components/ui/button"
import { PlusCircle } from "lucide-react"

const HomePage: React.FC = () => {
  const {
    data: pets,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["pets"],
    queryFn: fetchPets,
  })

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg font-medium text-blue-700">
          Loading pets...
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="text-destructive text-lg font-medium">
          Error loading pets
        </div>
        <Button
          onClick={() => window.location.reload()}
          className="bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md"
        >
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center bg-white/70 backdrop-blur-sm p-6 rounded-xl shadow-md">
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
          Your Pets
        </h1>
        <Button asChild variant="primary">
          <Link to="/add-pet" className="flex items-center gap-2">
            <PlusCircle className="h-4 w-4" />
            Add Pet
          </Link>
        </Button>
      </div>

      {pets && pets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {pets.map((pet) => (
            <PetCard key={pet.id} pet={pet} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 gap-6 bg-white/70 backdrop-blur-sm rounded-xl shadow-md">
          <p className="text-blue-700 text-xl font-medium">
            You don't have any pets yet
          </p>
          <Button asChild variant="primary" className="px-6 py-6 text-lg">
            <Link to="/add-pet" className="flex items-center gap-3">
              <PlusCircle className="h-5 w-5" />
              Add Your First Pet
            </Link>
          </Button>
        </div>
      )}
    </div>
  )
}

export default HomePage
