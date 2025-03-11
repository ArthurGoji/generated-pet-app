import { Pet, CareInstruction, EmergencyContact, Caretaker } from "../types"

// Storage keys
const STORAGE_KEYS = {
  PETS: "pet-app-pets",
  CARE_INSTRUCTIONS: "pet-app-care-instructions",
  EMERGENCY_CONTACTS: "pet-app-emergency-contacts",
  CARETAKERS: "pet-app-caretakers",
  USERS: "pet-app-users",
  SERVER_STATUS: "pet-app-server-status",
}

// Helper functions
const getItem = <T>(key: string): T[] => {
  try {
    const data = localStorage.getItem(key)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error(`Error retrieving ${key} from localStorage:`, error)
    return []
  }
}

const setItem = <T>(key: string, data: T[]): void => {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error)
  }
}

// Generate a unique ID for new items
const generateId = (): number => {
  return Date.now() + Math.floor(Math.random() * 1000)
}

// Pet operations
export const getPets = (): Pet[] => {
  return getItem<Pet>(STORAGE_KEYS.PETS)
}

export const getPetById = (id: number): Pet | undefined => {
  const pets = getPets()
  return pets.find((pet) => pet.id === id)
}

export const savePet = (pet: Omit<Pet, "id">): Pet => {
  const pets = getPets()
  const newPet = { ...pet, id: generateId() }
  setItem(STORAGE_KEYS.PETS, [...pets, newPet])
  return newPet
}

export const updatePetInStorage = (
  id: number,
  updatedPet: Partial<Pet>
): Pet | undefined => {
  const pets = getPets()
  const index = pets.findIndex((pet) => pet.id === id)

  if (index !== -1) {
    const updated = { ...pets[index], ...updatedPet }
    pets[index] = updated
    setItem(STORAGE_KEYS.PETS, pets)
    return updated
  }

  return undefined
}

export const deletePetFromStorage = (id: number): boolean => {
  const pets = getPets()
  const filteredPets = pets.filter((pet) => pet.id !== id)

  if (filteredPets.length !== pets.length) {
    setItem(STORAGE_KEYS.PETS, filteredPets)
    return true
  }

  return false
}

// Care Instructions operations
export const getCareInstructions = (petId?: number): CareInstruction[] => {
  const instructions = getItem<CareInstruction>(STORAGE_KEYS.CARE_INSTRUCTIONS)
  return petId
    ? instructions.filter((instruction) => instruction.petId === petId)
    : instructions
}

export const saveCareInstruction = (
  instruction: Omit<CareInstruction, "id">
): CareInstruction => {
  const instructions = getCareInstructions()
  const newInstruction = { ...instruction, id: generateId() }
  setItem(STORAGE_KEYS.CARE_INSTRUCTIONS, [...instructions, newInstruction])
  return newInstruction
}

export const updateCareInstructionInStorage = (
  id: number | string,
  updatedInstruction: Partial<CareInstruction>
): CareInstruction | undefined => {
  const instructions = getCareInstructions()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const index = instructions.findIndex(
    (instruction) => instruction.id === numericId
  )

  if (index !== -1) {
    const updated = { ...instructions[index], ...updatedInstruction }
    instructions[index] = updated
    setItem(STORAGE_KEYS.CARE_INSTRUCTIONS, instructions)
    return updated
  }

  return undefined
}

export const deleteCareInstructionFromStorage = (
  id: number | string
): boolean => {
  const instructions = getCareInstructions()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const filteredInstructions = instructions.filter(
    (instruction) => instruction.id !== numericId
  )

  if (filteredInstructions.length !== instructions.length) {
    setItem(STORAGE_KEYS.CARE_INSTRUCTIONS, filteredInstructions)
    return true
  }

  return false
}

// Emergency Contacts operations
export const getEmergencyContacts = (petId?: number): EmergencyContact[] => {
  const contacts = getItem<EmergencyContact>(STORAGE_KEYS.EMERGENCY_CONTACTS)
  return petId
    ? contacts.filter((contact) => contact.petId === petId)
    : contacts
}

export const saveEmergencyContact = (
  contact: Omit<EmergencyContact, "id">
): EmergencyContact => {
  const contacts = getEmergencyContacts()
  const newContact = { ...contact, id: generateId() }
  setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, [...contacts, newContact])
  return newContact
}

export const updateEmergencyContactInStorage = (
  id: number | string,
  updatedContact: Partial<EmergencyContact>
): EmergencyContact | undefined => {
  const contacts = getEmergencyContacts()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const index = contacts.findIndex((contact) => contact.id === numericId)

  if (index !== -1) {
    const updated = { ...contacts[index], ...updatedContact }
    contacts[index] = updated
    setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, contacts)
    return updated
  }

  return undefined
}

export const deleteEmergencyContactFromStorage = (
  id: number | string
): boolean => {
  const contacts = getEmergencyContacts()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const filteredContacts = contacts.filter(
    (contact) => contact.id !== numericId
  )

  if (filteredContacts.length !== contacts.length) {
    setItem(STORAGE_KEYS.EMERGENCY_CONTACTS, filteredContacts)
    return true
  }

  return false
}

// Caretakers operations
export const getCaretakers = (petId?: number): Caretaker[] => {
  const caretakers = getItem<Caretaker>(STORAGE_KEYS.CARETAKERS)
  return petId
    ? caretakers.filter((caretaker) => caretaker.petId === petId)
    : caretakers
}

export const saveCaretaker = (caretaker: Omit<Caretaker, "id">): Caretaker => {
  const caretakers = getCaretakers()
  const newCaretaker = { ...caretaker, id: generateId() }
  setItem(STORAGE_KEYS.CARETAKERS, [...caretakers, newCaretaker])
  return newCaretaker
}

export const updateCaretakerInStorage = (
  id: number | string,
  updatedCaretaker: Partial<Caretaker>
): Caretaker | undefined => {
  const caretakers = getCaretakers()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const index = caretakers.findIndex((caretaker) => caretaker.id === numericId)

  if (index !== -1) {
    const updated = { ...caretakers[index], ...updatedCaretaker }
    caretakers[index] = updated
    setItem(STORAGE_KEYS.CARETAKERS, caretakers)
    return updated
  }

  return undefined
}

export const deleteCaretakerFromStorage = (id: number | string): boolean => {
  const caretakers = getCaretakers()
  const numericId = typeof id === "string" ? parseInt(id) : id
  const filteredCaretakers = caretakers.filter(
    (caretaker) => caretaker.id !== numericId
  )

  if (filteredCaretakers.length !== caretakers.length) {
    setItem(STORAGE_KEYS.CARETAKERS, filteredCaretakers)
    return true
  }

  return false
}

// Server status
export const setServerStatus = (isOnline: boolean): void => {
  localStorage.setItem(
    STORAGE_KEYS.SERVER_STATUS,
    JSON.stringify({ isOnline, lastChecked: Date.now() })
  )
}

export const getServerStatus = (): {
  isOnline: boolean
  lastChecked: number
} => {
  try {
    const status = localStorage.getItem(STORAGE_KEYS.SERVER_STATUS)
    return status ? JSON.parse(status) : { isOnline: true, lastChecked: 0 }
  } catch {
    return { isOnline: true, lastChecked: 0 }
  }
}

// Sync data with server when it comes back online
export const syncWithServer = async (): Promise<void> => {
  // This function would be implemented to sync local changes with the server
  // when it comes back online. For now, it's a placeholder.
  console.log("Syncing data with server...")
}
