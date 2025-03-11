import { processAllPendingChanges, PendingChange } from "./offlineSync"
import {
  createPet,
  updatePet,
  deletePet,
  createCareInstruction,
  updateCareInstruction,
  deleteCareInstruction,
  createEmergencyContact,
  updateEmergencyContact,
  deleteEmergencyContact,
  createCaretaker,
  updateCaretaker,
  deleteCaretaker,
} from "../api"
import { Pet, CareInstruction, EmergencyContact, Caretaker } from "../types"

// Sync all pending changes with the server
export const syncPendingChanges = async (): Promise<void> => {
  try {
    await processAllPendingChanges({
      pet: syncPetChange,
      careInstruction: syncCareInstructionChange,
      emergencyContact: syncEmergencyContactChange,
      caretaker: syncCaretakerChange,
    })
  } catch (error) {
    console.error("Error syncing pending changes:", error)
    throw error
  }
}

// Sync a pet change
const syncPetChange = async (change: PendingChange): Promise<boolean> => {
  try {
    if (!change.data) return false

    switch (change.changeType) {
      case "create":
        await createPet(change.data as Omit<Pet, "id">)
        break
      case "update":
        await updatePet(Number(change.entityId), change.data as Partial<Pet>)
        break
      case "delete":
        await deletePet(Number(change.entityId))
        break
    }
    return true
  } catch (error) {
    console.error(`Error syncing pet change ${change.id}:`, error)
    return false
  }
}

// Sync a care instruction change
const syncCareInstructionChange = async (
  change: PendingChange
): Promise<boolean> => {
  try {
    if (!change.data && change.changeType !== "delete") return false

    switch (change.changeType) {
      case "create":
        await createCareInstruction(change.data as Omit<CareInstruction, "id">)
        break
      case "update":
        await updateCareInstruction(
          change.entityId,
          change.data as Partial<CareInstruction>
        )
        break
      case "delete":
        await deleteCareInstruction(change.entityId)
        break
    }
    return true
  } catch (error) {
    console.error(`Error syncing care instruction change ${change.id}:`, error)
    return false
  }
}

// Sync an emergency contact change
const syncEmergencyContactChange = async (
  change: PendingChange
): Promise<boolean> => {
  try {
    if (!change.data && change.changeType !== "delete") return false

    switch (change.changeType) {
      case "create":
        await createEmergencyContact(
          change.data as Omit<EmergencyContact, "id">
        )
        break
      case "update":
        await updateEmergencyContact(
          change.entityId,
          change.data as Partial<EmergencyContact>
        )
        break
      case "delete":
        await deleteEmergencyContact(change.entityId)
        break
    }
    return true
  } catch (error) {
    console.error(`Error syncing emergency contact change ${change.id}:`, error)
    return false
  }
}

// Sync a caretaker change
const syncCaretakerChange = async (change: PendingChange): Promise<boolean> => {
  try {
    if (!change.data && change.changeType !== "delete") return false

    switch (change.changeType) {
      case "create":
        await createCaretaker(change.data as Omit<Caretaker, "id">)
        break
      case "update":
        await updateCaretaker(
          change.entityId,
          change.data as Partial<Caretaker>
        )
        break
      case "delete":
        await deleteCaretaker(change.entityId)
        break
    }
    return true
  } catch (error) {
    console.error(`Error syncing caretaker change ${change.id}:`, error)
    return false
  }
}
