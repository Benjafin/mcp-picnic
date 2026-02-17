import PicnicClient from "picnic-api"
import { config } from "../config.js"

const PICNIC_IMAGE_BASE = `https://storefront-prod.${(config.PICNIC_COUNTRY_CODE || "NL").toLowerCase()}.picnicinternational.com/static/images`

export function getImageUrl(imageId: string, size: string = "small"): string {
  return `${PICNIC_IMAGE_BASE}/${imageId}/${size}.png`
}

// Singleton instance for caching
let picnicClientInstance: InstanceType<typeof PicnicClient> | null = null

export async function initializePicnicClient(
  username?: string,
  password?: string,
  countryCode?: "NL" | "DE",
  apiVersion: string = "15",
): Promise<void> {
  if (picnicClientInstance) {
    return
  }

  console.error("Initializing Picnic client...")
  const loginUsername = username || config.PICNIC_USERNAME
  const loginPassword = password || config.PICNIC_PASSWORD
  const loginCountryCode = countryCode || config.PICNIC_COUNTRY_CODE

  const client = new PicnicClient({
    countryCode: loginCountryCode,
    apiVersion,
  })

  await client.login(loginUsername, loginPassword)
  picnicClientInstance = client
  console.error("Picnic client initialized successfully.")
}

export function getPicnicClient(): InstanceType<typeof PicnicClient> {
  if (!picnicClientInstance) {
    throw new Error("Picnic client has not been initialized. Call initializePicnicClient() first.")
  }
  return picnicClientInstance
}

export function resetPicnicClient(): void {
  picnicClientInstance = null
}
