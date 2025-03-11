import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import { createCaretaker, fetchPetById, fetchUsers } from "../api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft } from "lucide-react"
import { Caretaker, AccessLevel } from "../types"
import { useOfflineMutation } from "../hooks/useOfflineMutation"

const AddCaretakerPage: React.FC = () => {
  const navigate = useNavigate()
  const { petId } = useParams<{ petId: string }>()
  const parsedPetId = parseInt(petId || "0")

  const [caretakerType, setCaretakerType] = React.useState<"existing" | "new">(
    "new"
  )
  const [formData, setFormData] = React.useState({
    userId: "",
    name: "",
    email: "",
    phone: "",
    role: "",
    accessLevel: "limited",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const { data: pet } = useQuery({
    queryKey: ["pet", parsedPetId],
    queryFn: () => fetchPetById(parsedPetId),
    enabled: !!parsedPetId,
  })

  const { data: users } = useQuery({
    queryKey: ["users"],
    queryFn: fetchUsers,
  })

  const createCaretakerMutation = useOfflineMutation({
    mutationFn: createCaretaker,
    entityType: "caretakers",
    petId: parsedPetId,
    onSuccess: () => {
      navigate(`/pets/${parsedPetId}`)
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

    if (caretakerType === "existing") {
      if (!formData.userId) {
        newErrors.userId = "Please select a user"
      }
    } else {
      if (!formData.name.trim()) {
        newErrors.name = "Name is required"
      }

      if (!formData.email.trim()) {
        newErrors.email = "Email is required"
      } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
        newErrors.email = "Email is invalid"
      }

      if (!formData.phone.trim()) {
        newErrors.phone = "Phone number is required"
      }
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Create a partial caretaker object with the common fields
      const caretakerData: Partial<Omit<Caretaker, "id">> = {
        petId: parsedPetId,
        role: formData.role,
        accessLevel: formData.accessLevel as AccessLevel,
      }

      // Add the specific fields based on caretaker type
      if (caretakerType === "existing") {
        caretakerData.userId = parseInt(formData.userId)
      } else {
        caretakerData.name = formData.name
        caretakerData.email = formData.email
        caretakerData.phone = formData.phone
      }

      // Cast to the required type for the API call
      createCaretakerMutation.mutate(caretakerData as Omit<Caretaker, "id">)
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
          <h1 className="text-3xl font-bold">Add Caretaker</h1>
          <p className="text-muted-foreground">for {pet.name}</p>
        </div>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Caretaker Details</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="mb-6">
            <div className="flex gap-4">
              <label className="flex items-center">
                <input
                  type="radio"
                  name="caretakerType"
                  value="new"
                  checked={caretakerType === "new"}
                  onChange={() => setCaretakerType("new")}
                  className="mr-2"
                />
                Add New Caretaker
              </label>
              <label className="flex items-center">
                <input
                  type="radio"
                  name="caretakerType"
                  value="existing"
                  checked={caretakerType === "existing"}
                  onChange={() => setCaretakerType("existing")}
                  className="mr-2"
                />
                Select Existing User
              </label>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {caretakerType === "existing" ? (
              <div className="space-y-2">
                <label htmlFor="userId" className="text-sm font-medium">
                  Select User
                </label>
                <select
                  id="userId"
                  name="userId"
                  value={formData.userId}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.userId ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select a user</option>
                  {users?.map((user) => (
                    <option key={user.id} value={user.id}>
                      {user.name} ({user.email})
                    </option>
                  ))}
                </select>
                {errors.userId && (
                  <p className="text-sm text-destructive">{errors.userId}</p>
                )}
              </div>
            ) : (
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
                  <label htmlFor="email" className="text-sm font-medium">
                    Email
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.email ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.email && (
                    <p className="text-sm text-destructive">{errors.email}</p>
                  )}
                </div>

                <div className="space-y-2">
                  <label htmlFor="phone" className="text-sm font-medium">
                    Phone Number
                  </label>
                  <input
                    id="phone"
                    name="phone"
                    type="tel"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2 border rounded-md ${
                      errors.phone ? "border-destructive" : "border-input"
                    }`}
                  />
                  {errors.phone && (
                    <p className="text-sm text-destructive">{errors.phone}</p>
                  )}
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <input
                  id="role"
                  name="role"
                  type="text"
                  placeholder="e.g. Dog Walker, Pet Sitter"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.role ? "border-destructive" : "border-input"
                  }`}
                />
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
                )}
              </div>

              <div className="space-y-2">
                <label htmlFor="accessLevel" className="text-sm font-medium">
                  Access Level
                </label>
                <select
                  id="accessLevel"
                  name="accessLevel"
                  value={formData.accessLevel}
                  onChange={handleChange}
                  className="w-full p-2 border border-input rounded-md"
                >
                  <option value="limited">Limited Access</option>
                  <option value="full">Full Access</option>
                </select>
                <p className="text-xs text-muted-foreground">
                  Full access allows editing pet information and adding/removing
                  other caretakers
                </p>
              </div>
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
                disabled={createCaretakerMutation.isPending}
              >
                {createCaretakerMutation.isPending
                  ? "Adding..."
                  : "Add Caretaker"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default AddCaretakerPage
