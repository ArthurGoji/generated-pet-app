import React from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { CareInstruction } from "../../types"
import { Clock, Trash2, Edit } from "lucide-react"
import { Button } from "../ui/button"

interface CareInstructionCardProps {
  instruction: CareInstruction
  onEdit?: (instruction: CareInstruction) => void
  onDelete?: (id: number | string) => void
}

const CareInstructionCard: React.FC<CareInstructionCardProps> = ({
  instruction,
  onEdit,
  onDelete,
}) => {
  return (
    <Card className="overflow-hidden shadow-lg hover:shadow-xl transition-all duration-300 border-none rounded-xl">
      <CardHeader className="p-4 bg-white">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-lg text-blue-800">
              {instruction.title}
            </CardTitle>
            <div className="flex items-center text-sm text-blue-600">
              <Clock className="h-4 w-4 mr-1" />
              <span>{instruction.time}</span>
            </div>
          </div>
          <div className="flex gap-2">
            {onEdit && (
              <Button
                onClick={() => onEdit(instruction)}
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 rounded-full bg-blue-100 hover:bg-blue-200"
              >
                <Edit className="h-4 w-4 text-blue-600" />
                <span className="sr-only">Edit</span>
              </Button>
            )}
            {onDelete && (
              <Button
                onClick={() => onDelete(instruction.id)}
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
        <p className="text-sm text-gray-600">{instruction.description}</p>
      </CardContent>
    </Card>
  )
}

export default CareInstructionCard
