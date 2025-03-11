import React from "react"
import { useParams, Link, useNavigate } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  fetchPetById,
  fetchCareInstructions,
  fetchEmergencyContacts,
  fetchCaretakers,
  deleteEmergencyContact,
  deleteCareInstruction,
} from "../api"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"
import CareInstructionCard from "../components/care/CareInstructionCard"
import EmergencyContactCard from "../components/emergency/EmergencyContactCard"
import CaretakerCard from "../components/caretakers/CaretakerCard"
import QRCodeGenerator from "../components/qr/QRCodeGenerator"
import { ArrowLeft, Plus, QrCode, Edit } from "lucide-react"
import { EmergencyContact } from "../types"
import { getPetImageUrl } from "../utils/petImages"
import { useOfflineMutation } from "../hooks/useOfflineMutation"
import OfflineDataNotice from "../components/ui/OfflineDataNotice"

const PetDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>()
  const petId = parseInt(id || "0")
  const [showQRCode, setShowQRCode] = React.useState(false)
  const navigate = useNavigate()

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

  const { data: caretakers, isLoading: isLoadingCaretakers } = useQuery({
    queryKey: ["caretakers", petId],
    queryFn: () => fetchCaretakers(petId),
    enabled: !!petId,
  })

  const deleteContactMutation = useOfflineMutation({
    mutationFn: deleteEmergencyContact,
    entityType: "emergencyContacts",
    petId,
  })

  const deleteCareInstructionMutation = useOfflineMutation({
    mutationFn: deleteCareInstruction,
    entityType: "careInstructions",
    petId,
  })

  const handleEditContact = (contact: EmergencyContact) => {
    const contactId = contact.id
    const editUrl = `/pets/${petId}/emergency/${contactId}/edit`

    try {
      navigate(editUrl)

      setTimeout(() => {
        if (window.location.pathname !== editUrl) {
          window.location.href = editUrl
        }
      }, 100)
    } catch {
      window.location.href = editUrl
    }
  }

  const handleDeleteContact = (contactId: number | string) => {
    if (
      window.confirm("Are you sure you want to delete this emergency contact?")
    ) {
      deleteContactMutation.mutate(contactId)
    }
  }

  const handleDeleteCareInstruction = (instructionId: number | string) => {
    if (
      window.confirm("Are you sure you want to delete this care instruction?")
    ) {
      deleteCareInstructionMutation.mutate(instructionId)
    }
  }

  const isLoading =
    isLoadingPet ||
    isLoadingInstructions ||
    isLoadingContacts ||
    isLoadingCaretakers

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg font-medium text-blue-700">
          Loading pet information...
        </div>
      </div>
    )
  }

  if (!pet) {
    return (
      <div className="flex flex-col justify-center items-center min-h-[50vh] gap-4">
        <div className="text-destructive text-lg">Pet not found</div>
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  const qrCodeData = `${window.location.origin}/shared/pet/${pet.id}`

  return (
    <div className="space-y-8">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to="/">
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
          {pet.name}
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <Card className="overflow-hidden shadow-lg rounded-xl">
            <div className="aspect-square w-full overflow-hidden">
              <img
                src={getPetImageUrl(pet.type, pet.imageUrl)}
                alt={pet.name}
                className="h-full w-full object-cover"
              />
            </div>
            <CardContent className="p-5 bg-white">
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
              <p className="mt-4 text-gray-600">{pet.description}</p>
              <div className="mt-4 space-y-2">
                <Button
                  onClick={() => setShowQRCode(!showQRCode)}
                  className="w-full flex items-center justify-center gap-2 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 shadow-md hover:shadow-lg transition-all duration-300 rounded-lg"
                >
                  <QrCode className="h-4 w-4" />
                  {showQRCode ? "Hide QR Code" : "Show QR Code"}
                </Button>
                <Button
                  asChild
                  variant="primary"
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Link to={`/pets/${pet.id}/edit`}>
                    <Edit className="h-4 w-4" />
                    Edit Pet
                  </Link>
                </Button>
              </div>
            </CardContent>
          </Card>

          {showQRCode && (
            <div className="mt-6">
              <QRCodeGenerator
                data={qrCodeData}
                title="Share Pet Information"
              />
            </div>
          )}
        </div>

        <div className="md:col-span-2 space-y-6">
          {/* Care Instructions Section */}
          <section>
            <div className="flex justify-between items-center mb-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
                Care Instructions
              </h2>
              <Button asChild variant="primary">
                <Link
                  to={`/pets/${pet.id}/care/add`}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Instruction
                </Link>
              </Button>
            </div>

            <OfflineDataNotice entityType="care instructions" />

            {careInstructions && careInstructions.length > 0 ? (
              <div className="grid grid-cols-1 gap-4">
                {careInstructions.map((instruction) => (
                  <CareInstructionCard
                    key={instruction.id}
                    instruction={instruction}
                    onDelete={handleDeleteCareInstruction}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm shadow-md rounded-xl">
                <CardContent className="p-6 text-center">
                  <p className="text-blue-700 mb-4">
                    No care instructions added yet
                  </p>
                  <Button asChild variant="primary">
                    <Link to={`/pets/${pet.id}/care/add`}>
                      Add First Instruction
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Emergency Contacts Section */}
          <section>
            <div className="flex justify-between items-center mb-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
                Emergency Contacts
              </h2>
              <Button asChild variant="primary">
                <Link
                  to={`/pets/${pet.id}/emergency/add`}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Contact
                </Link>
              </Button>
            </div>

            <OfflineDataNotice entityType="emergency contacts" />

            {emergencyContacts && emergencyContacts.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {emergencyContacts.map((contact) => (
                  <EmergencyContactCard
                    key={contact.id}
                    contact={contact}
                    onEdit={handleEditContact}
                    onDelete={handleDeleteContact}
                  />
                ))}
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm shadow-md rounded-xl">
                <CardContent className="p-6 text-center">
                  <p className="text-blue-700 mb-4">
                    No emergency contacts added yet
                  </p>
                  <Button asChild variant="primary">
                    <Link to={`/pets/${pet.id}/emergency/add`}>
                      Add First Contact
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>

          {/* Caretakers Section */}
          <section>
            <div className="flex justify-between items-center mb-4 bg-white/70 backdrop-blur-sm p-4 rounded-xl shadow-md">
              <h2 className="text-2xl font-semibold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
                Caretakers
              </h2>
              <Button asChild variant="primary">
                <Link
                  to={`/pets/${pet.id}/caretakers/add`}
                  className="flex items-center gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Add Caretaker
                </Link>
              </Button>
            </div>

            <OfflineDataNotice entityType="caretakers" />

            {caretakers && caretakers.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {caretakers.map((caretaker) => (
                  <CaretakerCard key={caretaker.id} caretaker={caretaker} />
                ))}
              </div>
            ) : (
              <Card className="bg-white/70 backdrop-blur-sm shadow-md rounded-xl">
                <CardContent className="p-6 text-center">
                  <p className="text-blue-700 mb-4">No caretakers added yet</p>
                  <Button asChild variant="primary">
                    <Link to={`/pets/${pet.id}/caretakers/add`}>
                      Add First Caretaker
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </section>
        </div>
      </div>
    </div>
  )
}

export default PetDetailPage
