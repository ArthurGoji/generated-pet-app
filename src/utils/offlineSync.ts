// Define types for pending changes
type ChangeType = "create" | "update" | "delete"
type EntityType = "pet" | "careInstruction" | "emergencyContact" | "caretaker"

export interface PendingChange {
  id: string
  timestamp: number
  entityType: EntityType
  changeType: ChangeType
  entityId: number | string
  data?: Record<string, unknown>
}

// Storage key for pending changes
const PENDING_CHANGES_KEY = "pet-app-pending-changes"

// Get all pending changes
export const getPendingChanges = (): PendingChange[] => {
  try {
    const data = localStorage.getItem(PENDING_CHANGES_KEY)
    return data ? JSON.parse(data) : []
  } catch (error) {
    console.error("Error retrieving pending changes from localStorage:", error)
    return []
  }
}

// Save pending changes
const savePendingChanges = (changes: PendingChange[]): void => {
  try {
    localStorage.setItem(PENDING_CHANGES_KEY, JSON.stringify(changes))
  } catch (error) {
    console.error("Error saving pending changes to localStorage:", error)
  }
}

// Add a pending change
export const addPendingChange = (
  entityType: EntityType,
  changeType: ChangeType,
  entityId: number | string,
  data?: Record<string, unknown>
): void => {
  const changes = getPendingChanges()

  // Create a unique ID for this change
  const changeId = `${entityType}-${changeType}-${entityId}-${Date.now()}`

  // Add the new change
  changes.push({
    id: changeId,
    timestamp: Date.now(),
    entityType,
    changeType,
    entityId,
    data,
  })

  savePendingChanges(changes)
}

// Remove a pending change
export const removePendingChange = (changeId: string): void => {
  const changes = getPendingChanges()
  const filteredChanges = changes.filter((change) => change.id !== changeId)
  savePendingChanges(filteredChanges)
}

// Clear all pending changes
export const clearPendingChanges = (): void => {
  savePendingChanges([])
}

// Process pending changes for a specific entity type
export const processPendingChangesForEntity = async (
  entityType: EntityType,
  processFn: (change: PendingChange) => Promise<boolean>
): Promise<void> => {
  const changes = getPendingChanges()
  const entityChanges = changes.filter(
    (change) => change.entityType === entityType
  )

  // Sort changes by timestamp (oldest first)
  entityChanges.sort((a, b) => a.timestamp - b.timestamp)

  // Process each change
  for (const change of entityChanges) {
    try {
      const success = await processFn(change)
      if (success) {
        removePendingChange(change.id)
      }
    } catch (error) {
      console.error(`Error processing change ${change.id}:`, error)
    }
  }
}

// Process all pending changes
export const processAllPendingChanges = async (processFns: {
  [key in EntityType]: (change: PendingChange) => Promise<boolean>
}): Promise<void> => {
  // Process each entity type
  await processPendingChangesForEntity("pet", processFns.pet)
  await processPendingChangesForEntity(
    "careInstruction",
    processFns.careInstruction
  )
  await processPendingChangesForEntity(
    "emergencyContact",
    processFns.emergencyContact
  )
  await processPendingChangesForEntity("caretaker", processFns.caretaker)
}

// Check if there are pending changes
export const hasPendingChanges = (): boolean => {
  return getPendingChanges().length > 0
}

// Get count of pending changes
export const getPendingChangesCount = (): number => {
  return getPendingChanges().length
}
