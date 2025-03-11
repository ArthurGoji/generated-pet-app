// Default pet images based on pet type
const DEFAULT_PET_IMAGES = {
  Dog: "https://images.unsplash.com/photo-1543466835-00a7907e9de1?q=80&w=1000&auto=format&fit=crop",
  Cat: "https://images.unsplash.com/photo-1592194996308-7b43878e84a6?q=80&w=1000&auto=format&fit=crop",
  Bird: "https://images.unsplash.com/photo-1522926193341-e9ffd686c60f?q=80&w=1000&auto=format&fit=crop",
  Fish: "https://images.unsplash.com/photo-1522069169874-c58ec4b76be5?q=80&w=1000&auto=format&fit=crop",
  Reptile:
    "https://images.unsplash.com/photo-1548550023-2bdb3c5beed7?q=80&w=1000&auto=format&fit=crop",
  // Default image for any other pet type
  default:
    "https://images.unsplash.com/photo-1425082661705-1834bfd09dca?q=80&w=1000&auto=format&fit=crop",
}

/**
 * Get an appropriate image URL based on pet type
 * @param type The type of pet (Dog, Cat, etc.)
 * @param customUrl Optional custom URL that takes precedence if provided
 * @returns An image URL appropriate for the pet type
 */
export const getPetImageUrl = (type: string, customUrl?: string): string => {
  // If a custom URL is provided and not empty, use it
  if (customUrl && customUrl.trim() !== "") {
    return customUrl
  }

  // Check if we have a default image for this pet type
  const petType = type as keyof typeof DEFAULT_PET_IMAGES
  return DEFAULT_PET_IMAGES[petType] || DEFAULT_PET_IMAGES.default
}
