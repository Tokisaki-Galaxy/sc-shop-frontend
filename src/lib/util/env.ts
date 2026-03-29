export const getBaseURL = () => {
  return process.env.NEXT_PUBLIC_BASE_URL || "https://localhost:8000"
}

export const getHomepageReferenceImageURL = () => {
  return (
    process.env.NEXT_PUBLIC_HOMEPAGE_REFERENCE_IMAGE_URL ||
    "https://github.com/user-attachments/assets/51adf8f8-47ae-452a-bef1-60c30215084d"
  )
}
