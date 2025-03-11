import React from "react"
import { useParams } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  fetchPetById,
  fetchCareInstructions,
  fetchEmergencyContacts,
} from "../api"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import CareInstructionCard from "../components/care/CareInstructionCard"
import EmergencyContactCard from "../components/emergency/EmergencyContactCard"
import { getPetImageUrl } from "../utils/petImages"

const SharedPetViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const petId = parseInt(id || "0")

  const { data: pet, isLoading: isLoadingPet } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => fetchPetById(petId),
    enabled: !!petId,
  })

  const { data: careInstructions, isLoading: isLoadingInstructions } = useQuery(
    {
      queryKey: ["careInstructions", petId],
      queryFn: () => fetchCareInstructions(petId),
      enabled: !!petId,
    }
  )

  const { data: emergencyContacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["emergencyContacts", petId],
    queryFn: () => fetchEmergencyContacts(petId),
    enabled: !!petId,
  })

  const isLoading = isLoadingPet || isLoadingInstructions || isLoadingContacts

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg">Loading pet information...</div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="text-destructive text-lg">Pet not found</div>
      </div>
    )
  }

  return (
    <div className="container py-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-dark-green">
          {pet.name}'s Care Information
        </h1>
        <p className="text-muted-foreground mt-2">
          This page contains important information about caring for {pet.name}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="md:col-span-1">
          <Card>
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={getPetImageUrl(pet.type, pet.imageUrl)}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-4">
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Type:</span>
                  <span>{pet.type}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Breed:</span>
                  <span>{pet.breed}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Age:</span>
                  <span>{pet.age} years</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Weight:</span>
                  <span>{pet.weight}</span>
                </div>
              </div>
              <p className="mt-4">{pet.description}</p>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Care Instructions Section */}
          <Card>
            <CardHeader>
              <CardTitle>Care Instructions</CardTitle>
            </CardHeader>
            <CardContent>
              {careInstructions && careInstructions.length > 0 ? (
                <div className="grid grid-cols-1 gap-4">
                  {careInstructions.map((instruction) => (
                    <CareInstructionCard
                      key={instruction.id}
                      instruction={instruction}
                    />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No care instructions available
                </p>
              )}
            </CardContent>
          </Card>

          {/* Emergency Contacts Section */}
          <Card>
            <CardHeader>
              <CardTitle>Emergency Contacts</CardTitle>
            </CardHeader>
            <CardContent>
              {emergencyContacts && emergencyContacts.length > 0 ? (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {emergencyContacts.map((contact) => (
                    <EmergencyContactCard key={contact.id} contact={contact} />
                  ))}
                </div>
              ) : (
                <p className="text-center text-muted-foreground py-4">
                  No emergency contacts available
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="text-center text-sm text-muted-foreground">
        <p>This information was shared with you by the pet owner.</p>
        <p>Please contact them directly if you have any questions.</p>
      </div>
    </div>
  )
}

export default SharedPetViewPage
