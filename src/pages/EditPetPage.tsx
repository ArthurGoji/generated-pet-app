import React from "react"
import { useNavigate, Link, useParams } from "react-router-dom"
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { fetchPetById, updatePet } from "../api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft } from "lucide-react"
import { getPetImageUrl } from "../utils/petImages"
import { Pet } from "../types"

const EditPetPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const petId = parseInt(id || "0")
  const queryClient = useQueryClient()

  const [formData, setFormData] = React.useState({
    name: "",
    type: "",
    breed: "",
    age: "",
    weight: "",
    imageUrl: "",
    description: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})
  const [originalImageUrl, setOriginalImageUrl] = React.useState<string>("")

  // Fetch pet data
  const { data: pet, isLoading } = useQuery({
    queryKey: ["pet", petId],
    queryFn: () => fetchPetById(petId),
    enabled: !!petId,
  })

  // Set form data when pet data is loaded
  React.useEffect(() => {
    if (pet) {
      setFormData({
        name: pet.name,
        type: pet.type,
        breed: pet.breed,
        age: pet.age.toString(),
        weight: pet.weight,
        imageUrl: pet.imageUrl,
        description: pet.description,
      })
      setOriginalImageUrl(pet.imageUrl)
    }
  }, [pet])

  const updatePetMutation = useMutation({
    mutationFn: (data: Partial<Pet>) => updatePet(petId, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pet", petId] })
      navigate(`/pets/${petId}`)
    },
  })

  const handleChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.type.trim()) {
      newErrors.type = "Type is required"
    }

    if (!formData.breed.trim()) {
      newErrors.breed = "Breed is required"
    }

    if (!formData.age.trim()) {
      newErrors.age = "Age is required"
    } else if (isNaN(Number(formData.age)) || Number(formData.age) <= 0) {
      newErrors.age = "Age must be a positive number"
    }

    if (!formData.weight.trim()) {
      newErrors.weight = "Weight is required"
    }

    if (!formData.description.trim()) {
      newErrors.description = "Description is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Only update the image URL if it's changed
      const imageUrl =
        formData.imageUrl !== originalImageUrl
          ? getPetImageUrl(formData.type, formData.imageUrl)
          : formData.imageUrl

      updatePetMutation.mutate({
        name: formData.name,
        type: formData.type,
        breed: formData.breed,
        age: Number(formData.age),
        weight: formData.weight,
        imageUrl,
        description: formData.description,
      })
    }
  }

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
        <Button asChild>
          <Link to="/">Back to Home</Link>
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Button variant="ghost" size="icon" asChild>
          <Link to={`/pets/${petId}`}>
            <ArrowLeft className="h-5 w-5" />
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Edit {pet.name}</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pet Information</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="name" className="text-sm font-medium">
                  Name
                </label>
                <input
                  id="name"
                  name="name"
                  type="text"
                  value={formData.name}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.name ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.name && (
                  <p className="text-sm text-destructive">{errors.name}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="type" className="text-sm font-medium">
                  Type
                </label>
                <select
                  id="type"
                  name="type"
                  value={formData.type}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.type ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select pet type</option>
                  <option value="Dog">Dog</option>
                  <option value="Cat">Cat</option>
                  <option value="Bird">Bird</option>
                  <option value="Fish">Fish</option>
                  <option value="Reptile">Reptile</option>
                  <option value="Other">Other</option>
                </select>
                {errors.type && (
                  <p className="text-sm text-destructive">{errors.type}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="breed" className="text-sm font-medium">
                  Breed
                </label>
                <input
                  id="breed"
                  name="breed"
                  type="text"
                  value={formData.breed}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.breed ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.breed && (
                  <p className="text-sm text-destructive">{errors.breed}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="age" className="text-sm font-medium">
                  Age (years)
                </label>
                <input
                  id="age"
                  name="age"
                  type="number"
                  min="0"
                  step="0.1"
                  value={formData.age}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.age ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.age && (
                  <p className="text-sm text-destructive">{errors.age}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="weight" className="text-sm font-medium">
                  Weight
                </label>
                <input
                  id="weight"
                  name="weight"
                  type="text"
                  placeholder="e.g. 65 lbs"
                  value={formData.weight}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.weight ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.weight && (
                  <p className="text-sm text-destructive">{errors.weight}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="imageUrl" className="text-sm font-medium">
                  Image URL (optional)
                </label>
                <input
                  id="imageUrl"
                  name="imageUrl"
                  type="text"
                  value={formData.imageUrl}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-md"
                />
              </div>
            </div>

            <div className="space-y-2">
              <label htmlFor="description" className="text-sm font-medium">
                Description
              </label>
              <textarea
                id="description"
                name="description"
                rows={4}
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
                onClick={() => navigate(`/pets/${petId}`)}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updatePetMutation.isPending}
              >
                {updatePetMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditPetPage
