import {
  Pet,
  CareInstruction,
  EmergencyContact,
  Caretaker,
  User,
} from "../types"

import {
  getPets,
  getPetById,
  savePet,
  updatePetInStorage,
  deletePetFromStorage,
  getCareInstructions,
  saveCareInstruction,
  updateCareInstructionInStorage,
  deleteCareInstructionFromStorage,
  getEmergencyContacts,
  saveEmergencyContact,
  updateEmergencyContactInStorage,
  deleteEmergencyContactFromStorage,
  getCaretakers,
  saveCaretaker,
  updateCaretakerInStorage,
  deleteCaretakerFromStorage,
} from "../utils/localStorage"

import { withFallback, withMutationFallback } from "../utils/serverStatus"
import { addPendingChange } from "../utils/offlineSync"

const API_URL = "http://localhost:3001"

// Pet API
export const fetchPets = async (): Promise<Pet[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/pets`)
      if (!response.ok) {
        throw new Error("Failed to fetch pets")
      }
      return response.json()
    },
    () => getPets()
  )
}

export const fetchPetById = async (id: number): Promise<Pet> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/pets/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch pet with id ${id}`)
      }
      return response.json()
    },
    () => {
      const pet = getPetById(id)
      if (!pet) {
        throw new Error(`Pet with id ${id} not found in local storage`)
      }
      return pet
    }
  )
}

export const createPet = async (pet: Omit<Pet, "id">): Promise<Pet> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/pets`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pet),
      })
      if (!response.ok) {
        throw new Error("Failed to create pet")
      }
      return response.json()
    },
    () => savePet(pet)
  )
}

export const updatePet = async (
  id: number,
  pet: Partial<Pet>
): Promise<Pet> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(pet),
      })
      if (!response.ok) {
        throw new Error(`Failed to update pet with id ${id}`)
      }
      return response.json()
    },
    () => {
      const updatedPet = updatePetInStorage(id, pet)
      if (!updatedPet) {
        throw new Error(`Pet with id ${id} not found in local storage`)
      }
      return updatedPet
    }
  )
}

export const deletePet = async (id: number): Promise<void> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/pets/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Failed to delete pet with id ${id}`)
      }
      return
    },
    () => {
      const success = deletePetFromStorage(id)
      if (!success) {
        throw new Error(`Pet with id ${id} not found in local storage`)
      }
      return
    }
  )
}

// Care Instructions API
export const fetchCareInstructions = async (
  petId: number
): Promise<CareInstruction[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/careInstructions?petId=${petId}`)
      if (!response.ok) {
        throw new Error(
          `Failed to fetch care instructions for pet with id ${petId}`
        )
      }
      return response.json()
    },
    () => getCareInstructions(petId)
  )
}

export const createCareInstruction = async (
  instruction: Omit<CareInstruction, "id">
): Promise<CareInstruction> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/careInstructions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instruction),
      })
      if (!response.ok) {
        throw new Error("Failed to create care instruction")
      }
      return response.json()
    },
    () => {
      // Save to local storage
      const newInstruction = saveCareInstruction(instruction)

      // Track as pending change
      addPendingChange(
        "careInstruction",
        "create",
        newInstruction.id,
        newInstruction as unknown as Record<string, unknown>
      )

      return newInstruction
    }
  )
}

export const updateCareInstruction = async (
  id: number | string,
  instruction: Partial<CareInstruction>
): Promise<CareInstruction> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/careInstructions/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(instruction),
      })
      if (!response.ok) {
        throw new Error(`Failed to update care instruction with id ${id}`)
      }
      return response.json()
    },
    () => {
      const updatedInstruction = updateCareInstructionInStorage(id, instruction)
      if (!updatedInstruction) {
        throw new Error(
          `Care instruction with id ${id} not found in local storage`
        )
      }

      // Track as pending change
      addPendingChange("careInstruction", "update", id, instruction)

      return updatedInstruction
    }
  )
}

export const deleteCareInstruction = async (
  id: number | string
): Promise<void> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/careInstructions/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Failed to delete care instruction with id ${id}`)
      }
      return
    },
    () => {
      // Get the instruction before deleting (for sync purposes)
      const instruction = getCareInstructions().find(
        (i) => i.id === (typeof id === "string" ? parseInt(id) : id)
      )

      const success = deleteCareInstructionFromStorage(id)
      if (!success) {
        throw new Error(
          `Care instruction with id ${id} not found in local storage`
        )
      }

      // Track as pending change
      if (instruction) {
        addPendingChange(
          "careInstruction",
          "delete",
          id,
          instruction as unknown as Record<string, unknown>
        )
      }

      return
    }
  )
}

// Emergency Contacts API
export const fetchEmergencyContacts = async (
  petId: number
): Promise<EmergencyContact[]> => {
  return withFallback(
    async () => {
      const response = await fetch(
        `${API_URL}/emergencyContacts?petId=${petId}`
      )
      if (!response.ok) {
        throw new Error(
          `Failed to fetch emergency contacts for pet with id ${petId}`
        )
      }
      return response.json()
    },
    () => getEmergencyContacts(petId)
  )
}

export const createEmergencyContact = async (
  contact: Omit<EmergencyContact, "id">
): Promise<EmergencyContact> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/emergencyContacts`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })
      if (!response.ok) {
        throw new Error("Failed to create emergency contact")
      }
      return response.json()
    },
    () => {
      // Save to local storage
      const newContact = saveEmergencyContact(contact)

      // Track as pending change
      addPendingChange(
        "emergencyContact",
        "create",
        newContact.id,
        newContact as unknown as Record<string, unknown>
      )

      return newContact
    }
  )
}

export const updateEmergencyContact = async (
  id: number | string,
  contact: Partial<EmergencyContact>
): Promise<EmergencyContact> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/emergencyContacts/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(contact),
      })
      if (!response.ok) {
        throw new Error(`Failed to update emergency contact with id ${id}`)
      }
      return response.json()
    },
    () => {
      const updatedContact = updateEmergencyContactInStorage(id, contact)
      if (!updatedContact) {
        throw new Error(
          `Emergency contact with id ${id} not found in local storage`
        )
      }

      // Track as pending change
      addPendingChange(
        "emergencyContact",
        "update",
        id,
        contact as unknown as Record<string, unknown>
      )

      return updatedContact
    }
  )
}

export const deleteEmergencyContact = async (
  id: number | string
): Promise<void> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/emergencyContacts/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Failed to delete emergency contact with id ${id}`)
      }
      return
    },
    () => {
      // Get the contact before deleting (for sync purposes)
      const contact = getEmergencyContacts().find(
        (c) => c.id === (typeof id === "string" ? parseInt(id) : id)
      )

      const success = deleteEmergencyContactFromStorage(id)
      if (!success) {
        throw new Error(
          `Emergency contact with id ${id} not found in local storage`
        )
      }

      // Track as pending change
      if (contact) {
        addPendingChange(
          "emergencyContact",
          "delete",
          id,
          contact as unknown as Record<string, unknown>
        )
      }

      return
    }
  )
}

// Caretakers API
export const fetchCaretakers = async (petId: number): Promise<Caretaker[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/caretakers?petId=${petId}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch caretakers for pet with id ${petId}`)
      }
      return response.json()
    },
    () => getCaretakers(petId)
  )
}

export const createCaretaker = async (
  caretaker: Omit<Caretaker, "id">
): Promise<Caretaker> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/caretakers`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caretaker),
      })
      if (!response.ok) {
        throw new Error("Failed to create caretaker")
      }
      return response.json()
    },
    () => {
      // Save to local storage
      const newCaretaker = saveCaretaker(caretaker)

      // Track as pending change
      addPendingChange(
        "caretaker",
        "create",
        newCaretaker.id,
        newCaretaker as unknown as Record<string, unknown>
      )

      return newCaretaker
    }
  )
}

export const updateCaretaker = async (
  id: number | string,
  caretaker: Partial<Caretaker>
): Promise<Caretaker> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/caretakers/${id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(caretaker),
      })
      if (!response.ok) {
        throw new Error(`Failed to update caretaker with id ${id}`)
      }
      return response.json()
    },
    () => {
      const updatedCaretaker = updateCaretakerInStorage(id, caretaker)
      if (!updatedCaretaker) {
        throw new Error(`Caretaker with id ${id} not found in local storage`)
      }

      // Track as pending change
      addPendingChange(
        "caretaker",
        "update",
        id,
        caretaker as unknown as Record<string, unknown>
      )

      return updatedCaretaker
    }
  )
}

export const deleteCaretaker = async (id: number | string): Promise<void> => {
  return withMutationFallback(
    async () => {
      const response = await fetch(`${API_URL}/caretakers/${id}`, {
        method: "DELETE",
      })
      if (!response.ok) {
        throw new Error(`Failed to delete caretaker with id ${id}`)
      }
      return
    },
    () => {
      // Get the caretaker before deleting (for sync purposes)
      const caretaker = getCaretakers().find(
        (c) => c.id === (typeof id === "string" ? parseInt(id) : id)
      )

      const success = deleteCaretakerFromStorage(id)
      if (!success) {
        throw new Error(`Caretaker with id ${id} not found in local storage`)
      }

      // Track as pending change
      if (caretaker) {
        addPendingChange(
          "caretaker",
          "delete",
          id,
          caretaker as unknown as Record<string, unknown>
        )
      }

      return
    }
  )
}

// Users API
export const fetchUsers = async (): Promise<User[]> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/users`)
      if (!response.ok) {
        throw new Error("Failed to fetch users")
      }
      return response.json()
    },
    () => [] // For users, we don't have a local storage implementation yet
  )
}

export const fetchUserById = async (id: number): Promise<User> => {
  return withFallback(
    async () => {
      const response = await fetch(`${API_URL}/users/${id}`)
      if (!response.ok) {
        throw new Error(`Failed to fetch user with id ${id}`)
      }
      return response.json()
    },
    () => {
      throw new Error(`User with id ${id} not found in local storage`)
    }
  )
}
