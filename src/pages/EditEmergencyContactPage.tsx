import React from "react"
import { useNavigate, useParams, Link } from "react-router-dom"
import { useQuery } from "@tanstack/react-query"
import {
  fetchEmergencyContacts,
  updateEmergencyContact,
  fetchPetById,
} from "../api"
import { Button } from "../components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "../components/ui/card"
import { ArrowLeft } from "lucide-react"
import { EmergencyContact } from "../types"
import { useOfflineMutation } from "../hooks/useOfflineMutation"

const EditEmergencyContactPage: React.FC = () => {
  const navigate = useNavigate()
  const { petId, contactId } = useParams<{ petId: string; contactId: string }>()

  // Parse the IDs, but keep the original string values as well
  const parsedPetId = parseInt(petId || "0")
  // For contactId, we'll keep both the string and number versions
  const contactIdStr = contactId || "0"
  const parsedContactId = parseInt(contactIdStr)

  const [formData, setFormData] = React.useState({
    name: "",
    role: "",
    phone: "",
    email: "",
    address: "",
  })
  const [errors, setErrors] = React.useState<Record<string, string>>({})

  const { data: pet } = useQuery({
    queryKey: ["pet", parsedPetId],
    queryFn: () => fetchPetById(parsedPetId),
    enabled: !!parsedPetId,
  })

  // Fetch all emergency contacts for this pet
  const { data: contacts, isLoading: isLoadingContacts } = useQuery({
    queryKey: ["emergencyContacts", parsedPetId],
    queryFn: () => fetchEmergencyContacts(parsedPetId),
    enabled: !!parsedPetId,
  })

  // Use useEffect to pre-fill form data when contacts are loaded
  React.useEffect(() => {
    if (contacts && (parsedContactId || contactIdStr)) {
      // Try to find the contact with multiple comparison methods
      const contact = contacts.find(
        (c: EmergencyContact) =>
          // Compare as numbers
          c.id === parsedContactId ||
          // Compare as strings
          String(c.id) === contactIdStr ||
          // Compare with explicit conversions
          Number(c.id) === parsedContactId
      )

      if (contact) {
        setFormData({
          name: contact.name,
          role: contact.role,
          phone: contact.phone,
          email: contact.email,
          address: contact.address,
        })
      } else {
        // If contact not found, redirect back to pet detail page
        navigate(`/pets/${parsedPetId}`)
      }
    }
  }, [contacts, parsedContactId, contactIdStr, navigate, parsedPetId])

  const updateContactMutation = useOfflineMutation({
    mutationFn: ({
      id,
      data,
    }: {
      id: number | string
      data: Partial<typeof formData>
    }) => {
      return updateEmergencyContact(id, { ...data, petId: parsedPetId })
    },
    entityType: "emergencyContacts",
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

    if (!formData.name.trim()) {
      newErrors.name = "Name is required"
    }

    if (!formData.role.trim()) {
      newErrors.role = "Role is required"
    }

    if (!formData.phone.trim()) {
      newErrors.phone = "Phone number is required"
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid"
    }

    if (!formData.address.trim()) {
      newErrors.address = "Address is required"
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    if (validateForm()) {
      // Use the original contactId from the URL to ensure consistency
      updateContactMutation.mutate({
        id: contactIdStr || parsedContactId,
        data: formData,
      })
    }
  }

  if (isLoadingContacts || !pet) {
    return (
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-pulse text-lg font-medium text-blue-700">
          Loading...
        </div>
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
          <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-700 to-green-700 bg-clip-text text-transparent">
            Edit Emergency Contact
          </h1>
          <p className="text-muted-foreground">for {pet.name}</p>
        </div>
      </div>

      <Card className="shadow-md">
        <CardHeader className="bg-white/70 backdrop-blur-sm">
          <CardTitle>Emergency Contact Details</CardTitle>
        </CardHeader>
        <CardContent className="p-6">
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
                <label htmlFor="role" className="text-sm font-medium">
                  Role
                </label>
                <select
                  id="role"
                  name="role"
                  value={formData.role}
                  onChange={handleChange}
                  className={`w-full p-2 border rounded-md ${
                    errors.role ? "border-destructive" : "border-input"
                  }`}
                >
                  <option value="">Select role</option>
                  <option value="Veterinarian">Veterinarian</option>
                  <option value="Family Member">Family Member</option>
                  <option value="Neighbor">Neighbor</option>
                  <option value="Friend">Friend</option>
                  <option value="Pet Sitter">Pet Sitter</option>
                  <option value="Other">Other</option>
                </select>
                {errors.role && (
                  <p className="text-sm text-destructive">{errors.role}</p>
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
            </div>

            <div className="space-y-2">
              <label htmlFor="address" className="text-sm font-medium">
                Address
              </label>
              <textarea
                id="address"
                name="address"
                rows={3}
                value={formData.address}
                onChange={handleChange}
                className={`w-full p-2 border rounded-md ${
                  errors.address ? "border-destructive" : "border-input"
                }`}
              />
              {errors.address && (
                <p className="text-sm text-destructive">{errors.address}</p>
              )}
            </div>

            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => navigate(`/pets/${parsedPetId}`)}
                className="shadow-sm"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                variant="primary"
                disabled={updateContactMutation.isPending}
              >
                {updateContactMutation.isPending ? "Saving..." : "Save Changes"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

export default EditEmergencyContactPage
