import React from "react"
import { Link } from "react-router-dom"
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "../ui/card"
import { Button } from "../ui/button"
import { Pet } from "../../types"
import { getPetImageUrl } from "../../utils/petImages"

interface PetCardProps {
  pet: Pet
}

const PetCard: React.FC<PetCardProps> = ({ pet }) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <div className="aspect-square w-full overflow-hidden">
        <img
          src={getPetImageUrl(pet.type, pet.imageUrl)}
          alt={pet.name}
          className="h-full w-full object-cover transition-all hover:scale-105"
        />
      </div>
      <CardHeader className="p-5 bg-white">
        <CardTitle className="text-xl text-blue-800">{pet.name}</CardTitle>
        <div className="flex items-center text-sm text-blue-600">
          <span>
            {pet.type} • {pet.breed}
          </span>
        </div>
      </CardHeader>
      <CardContent className="p-5 pt-0 bg-white">
        <p className="line-clamp-2 text-sm text-gray-600">{pet.description}</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <span className="inline-flex items-center rounded-full bg-green-100 px-3 py-1 text-xs font-medium text-green-800">
            {pet.age} years old
          </span>
          <span className="inline-flex items-center rounded-full bg-blue-100 px-3 py-1 text-xs font-medium text-blue-800">
            {pet.weight}
          </span>
        </div>
      </CardContent>
      <CardFooter className="p-5 bg-white">
        <Button asChild variant="primary" className="w-full">
          <Link to={`/pets/${pet.id}`}>View Details</Link>
        </Button>
      </CardFooter>
    </Card>
  )
}

export default PetCard
