import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { EmergencyContact } from "../../types"
import { Phone, Mail, MapPin, Edit, Trash2 } from "lucide-react"
import { Button } from "../ui/button"
import { Link } from "react-router-dom"

interface EmergencyContactCardProps {
  contact: EmergencyContact
  onEdit?: (contact: EmergencyContact) => void
  onDelete?: (id: number | string) => void
}

const EmergencyContactCard: React.FC<EmergencyContactCardProps> = ({
  contact,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <CardHeader className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-blue-800">
              {contact.name}
            </CardTitle>
            <p className="text-sm text-blue-600">{contact.role}</p>
          </div>
          <div className="flex gap-2">
            <Button
              onClick={() => {
                if (onEdit) {
                  onEdit(contact)
                }
              }}
              variant="ghost"
              size="sm"
              className="h-8 w-8 p-0 rounded-full bg-blue-100 hover:bg-blue-200"
              asChild
            >
              <Link to={`/pets/${contact.petId}/emergency/${contact.id}/edit`}>
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="sr-only">Edit</span>
              </Link>
            </Button>
            {onDelete && (
              <Button
                onClick={() => onDelete(contact.id)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-red-100 hover:bg-red-200"
              >
                <Trash2 className="h-4 w-4 text-red-600" />
                <span className="sr-only">Delete</span>
              </Button>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-0 bg-white">
        <div className="space-y-3">
          <div className="flex items-center text-sm">
            <div className="p-1.5 rounded-full bg-green-100 mr-3">
              <Phone className="h-4 w-4 text-green-600" />
            </div>
            <a
              href={`tel:${contact.phone}`}
              className="hover:underline text-gray-700 hover:text-blue-600 transition-colors"
            >
              {contact.phone}
            </a>
          </div>
          <div className="flex items-center text-sm">
            <div className="p-1.5 rounded-full bg-blue-100 mr-3">
              <Mail className="h-4 w-4 text-blue-600" />
            </div>
            <a
              href={`mailto:${contact.email}`}
              className="hover:underline text-gray-700 hover:text-blue-600 transition-colors"
            >
              {contact.email}
            </a>
          </div>
          <div className="flex items-start text-sm">
            <div className="p-1.5 rounded-full bg-purple-100 mr-3 mt-0.5">
              <MapPin className="h-4 w-4 text-purple-600" />
            </div>
            <span className="text-gray-700">{contact.address}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default EmergencyContactCard
