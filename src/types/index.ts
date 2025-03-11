export interface Pet {
  id: number
  name: string
  type: string
  breed: string
  age: number
  weight: string
  ownerId: number
  imageUrl: string
  description: string
}

export interface User {
  id: number
  name: string
  email: string
  phone: string
}

export interface CareInstruction {
  id: number
  petId: number
  title: string
  description: string
  time: string
}

export interface EmergencyContact {
  id: number
  petId: number
  name: string
  role: string
  phone: string
  email: string
  address: string
}

export interface Caretaker {
  id: number
  petId: number
  userId?: number
  name?: string
  email?: string
  phone?: string
  role: string
  accessLevel: "full" | "limited"
}

export type AccessLevel = "full" | "limited"
