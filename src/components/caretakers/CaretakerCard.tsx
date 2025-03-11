import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Avatar, AvatarFallback } from "../ui/avatar"
import { Caretaker } from "../../types"

interface CaretakerCardProps {
  caretaker: Caretaker
  onEdit?: (caretaker: Caretaker) => void
  onDelete?: (id: number) => void
}

const CaretakerCard: React.FC<CaretakerCardProps> = ({
  caretaker,
  onEdit,
  onDelete,
}) => {
  // Get initials for avatar fallback
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .join("")
      .toUpperCase()
  }

  return (
    <Card className="overflow-hidden">
      <CardHeader className="p-4 bg-muted/50">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-3">
            <Avatar>
              <AvatarFallback>
                {caretaker.name ? getInitials(caretaker.name) : "CT"}
              </AvatarFallback>
            </Avatar>
            <div>
              <CardTitle className="text-lg">
                {caretaker.name || "Caretaker"}
              </CardTitle>
              <p className="text-sm text-muted-foreground">{caretaker.role}</p>
            </div>
          </div>
          {(onEdit || onDelete) && (
            <div className="flex gap-2">
              {onEdit && (
                <button
                  onClick={() => onEdit(caretaker)}
                  className="text-sm text-muted-foreground hover:text-foreground"
                >
                  Edit
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(caretaker.id)}
                  className="text-sm text-destructive hover:text-destructive/80"
                >
                  Delete
                </button>
              )}
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="p-4">
        <div className="space-y-2">
          {caretaker.email && (
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Email:</span>
              <a href={`mailto:${caretaker.email}`} className="hover:underline">
                {caretaker.email}
              </a>
            </div>
          )}
          {caretaker.phone && (
            <div className="flex items-center text-sm">
              <span className="text-muted-foreground mr-2">Phone:</span>
              <a href={`tel:${caretaker.phone}`} className="hover:underline">
                {caretaker.phone}
              </a>
            </div>
          )}
          <div className="flex items-center text-sm mt-2">
            <span className="text-muted-foreground mr-2">Access Level:</span>
            <span
              className={`px-2 py-1 rounded-full text-xs ${
                caretaker.accessLevel === "full"
                  ? "bg-secondary/20 text-secondary-foreground"
                  : "bg-muted text-muted-foreground"
              }`}
            >
              {caretaker.accessLevel === "full"
                ? "Full Access"
                : "Limited Access"}
            </span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default CaretakerCard
