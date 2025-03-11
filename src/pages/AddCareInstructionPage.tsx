import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { createCareInstruction, fetchPetById } from "../api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft } from "lucide-react"
import { useOfflineMutation } from "../hooks/useOfflineMutation"

const AddCareInstructionPage: React.FC = () => {
  const navigate = useNavigate()
  const { petId } = useParams<{ petId: string }>()
  const parsedPetId = parseInt(petId || "0")

  const [formData, setFormData] = React.useState({
    title: "",
    description: "",
    time: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const { data: pet } = useQuery({
    queryKey: ["pet", parsedPetId],
    queryFn: () => fetchPetById(parsedPetId),
    enabled: !!parsedPetId,
  })

  const createInstructionMutation = useOfflineMutation({
    mutationFn: createCareInstruction,
    entityType: "careInstructions",
    petId: parsedPetId,
    onSuccess: () => {
      navigate(`/pets/${parsedPetId}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))

    // Clear error when field is edited
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev }
        delete newErrors[name]
        return newErrors
      })
    }
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.title.trim()) {
      newErrors.title = "Title is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    if (!formData.time.trim()) {
      newErrors.time = "Time is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      createInstructionMutation.mutate({
        ...formData,
        petId: parsedPetId,
      })
    }
  }

  if (!pet) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/pets/${parsedPetId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Add Care Instruction</h1>
          <p className="text-muted-foreground">for {pet.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Care Instruction Details</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <input
                id="title"
                name="title"
                type="text"
                placeholder="e.g. Feeding, Walking, Medication"
                value={formData.title}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.title ? "border-destructive" : "border-input"
                }`}
              />
              {errors.title && (
                <p className="text-sm text-destructive">{errors.title}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="time" className="text-sm font-medium">
                Time/Schedule
              </label>
              <input
                id="time"
                name="time"
                type="text"
                placeholder="e.g. 8:00 AM, 6:00 PM or Morning, Evening"
                value={formData.time}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.time ? "border-destructive" : "border-input"
                }`}
              />
              {errors.time && (
                <p className="text-sm text-destructive">{errors.time}</p>
              )}
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
                placeholder="Detailed instructions..."
                value={formData.description}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.description ? "border-destructive" : "border-input"
                }`}
              />
              {errors.description && (
                <p className="text-sm text-destructive">{errors.description}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/pets/${parsedPetId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={createInstructionMutation.isPending}
              >
                {createInstructionMutation.isPending
                  ? "Adding..."
                  : "Add Instruction"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCareInstructionPage
