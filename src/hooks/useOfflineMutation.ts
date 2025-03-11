import { useMutation, useQueryClient } from "@tanstack/react-query"

type MutationFn<TData, TVariables> = (variables: TVariables) => Promise<TData>

interface UseOfflineMutationOptions<TData, TVariables> {
  mutationFn: MutationFn<TData, TVariables>
  entityType: string
  petId: number
  onSuccess?: (data: TData) => void
  onError?: (error: Error) => void
}

/**
 * Custom hook for handling mutations that need to work offline
 * Ensures that the React Query cache is properly invalidated even when offline
 */
export function useOfflineMutation<TData, TVariables>({
  mutationFn,
  entityType,
  petId,
  onSuccess,
  onError,
}: UseOfflineMutationOptions<TData, TVariables>) {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn,
    onSuccess: (data) => {
      // Invalidate the relevant query to update the UI
      queryClient.invalidateQueries({ queryKey: [entityType, petId] })

      // Call the custom onSuccess handler if provided
      if (onSuccess) {
        onSuccess(data)
      }
    },
    onError: (error: Error) => {
      console.error(`Failed to perform ${entityType} operation:`, error)

      // Even if there's an error (like being offline), we still want to refresh the UI
      // This ensures offline operations are reflected in the UI
      queryClient.invalidateQueries({ queryKey: [entityType, petId] })

      // Call the custom onError handler if provided
      if (onError) {
        onError(error)
      }
    },
  })
}
