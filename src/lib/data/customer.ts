"use server"

import { sdk } from "@lib/config"
import { OAuthProvider } from "@lib/types/auth"
import medusaError from "@lib/util/medusa-error"
import { HttpTypes } from "@medusajs/types"
import { revalidateTag } from "next/cache"
import { redirect } from "next/navigation"
import {
  getAuthHeaders,
  getCacheOptions,
  getCacheTag,
  getCartId,
  removeAuthToken,
  removeCartId,
  setAuthToken,
} from "./cookies"

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return error.message
  }

  return "An unexpected error occurred."
}

type DecodedAuthToken = {
  actor_id?: string
  user_metadata?: {
    email?: string
  }
}

const decodeJwtPayload = (token: string): DecodedAuthToken | null => {
  const parts = token.split(".")

  if (parts.length < 2) {
    return null
  }

  try {
    const base64 = parts[1].replace(/-/g, "+").replace(/_/g, "/")
    const padded = base64.padEnd(base64.length + ((4 - (base64.length % 4)) % 4), "=")
    const payload = Buffer.from(padded, "base64").toString("utf-8")
    return JSON.parse(payload) as DecodedAuthToken
  } catch {
    return null
  }
}

const isProviderMissingError = (error: unknown) => {
  if (!(error instanceof Error)) {
    return false
  }

  const maybeError = error as Error & { status?: unknown }
  const hasAuthProviderMessage = /auth provider with id/i.test(error.message)

  return hasAuthProviderMessage && maybeError.status === 401
}

const isNextRedirectError = (error: unknown) => {
  if (!error || typeof error !== "object" || !("digest" in error)) {
    return false
  }

  const digest = (error as { digest?: unknown }).digest
  return typeof digest === "string" && digest.startsWith("NEXT_REDIRECT")
}

type ResetPasswordResult = {
  success: boolean
  message: string
}

export const retrieveCustomer =
  async (): Promise<HttpTypes.StoreCustomer | null> => {
    const authHeaders = await getAuthHeaders()

    if (!authHeaders) return null

    const headers = {
      ...authHeaders,
    }

    const next = {
      ...(await getCacheOptions("customers")),
    }

    return await sdk.client
      .fetch<{ customer: HttpTypes.StoreCustomer }>(`/store/customers/me`, {
        method: "GET",
        query: {
          fields: "*orders",
        },
        headers,
        next,
        cache: "force-cache",
      })
      .then(({ customer }) => customer)
      .catch(() => null)
  }

export const updateCustomer = async (body: HttpTypes.StoreUpdateCustomer) => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  const updateRes = await sdk.store.customer
    .update(body, {}, headers)
    .then(({ customer }) => customer)
    .catch(medusaError)

  const cacheTag = await getCacheTag("customers")
  revalidateTag(cacheTag)

  return updateRes
}

export async function signup(_currentState: unknown, formData: FormData) {
  const password = formData.get("password") as string
  const customerForm = {
    email: formData.get("email") as string,
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    phone: formData.get("phone") as string,
  }

  try {
    const token = await sdk.auth.register("customer", "emailpass", {
      email: customerForm.email,
      password: password,
    })

    await setAuthToken(token as string)

    const headers = {
      ...(await getAuthHeaders()),
    }

    const { customer: createdCustomer } = await sdk.store.customer.create(
      customerForm,
      {},
      headers
    )

    const loginToken = await sdk.auth.login("customer", "emailpass", {
      email: customerForm.email,
      password,
    })

    await setAuthToken(loginToken as string)

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return createdCustomer
  } catch (error: any) {
    if (isProviderMissingError(error)) {
      return "Email/password sign-up is unavailable on this backend. Please use an available social sign-in option."
    }

    return error.toString()
  }
}

export async function login(_currentState: unknown, formData: FormData) {
  const email = formData.get("email") as string
  const password = formData.get("password") as string

  try {
    await sdk.auth
      .login("customer", "emailpass", { email, password })
      .then(async (token) => {
        await setAuthToken(token as string)
        const customerCacheTag = await getCacheTag("customers")
        revalidateTag(customerCacheTag)
      })
  } catch (error: any) {
    if (isProviderMissingError(error)) {
      return "Email/password sign-in is unavailable on this backend. Please use an available social sign-in option."
    }

    return error.toString()
  }

  try {
    await transferCart()
  } catch (error: any) {
    return error.toString()
  }
}

const loginWithOAuthProvider = async (provider: OAuthProvider) => {
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL?.replace(/\/$/, "")

  if (!baseUrl) {
    return "Missing NEXT_PUBLIC_BASE_URL. Please configure storefront base URL."
  }

  // Keep OAuth callback URI stable and country-code agnostic.
  // Do NOT include locale/country segments here, or provider redirect URI checks can fail.
  const callbackPath = `/account/oauth/${provider}/callback`
  const callbackUrl = `${baseUrl}${callbackPath}`

  try {
    const result = await sdk.auth.login("customer", provider, {
      ...(callbackUrl ? { callback_url: callbackUrl } : {}),
    })

    if (typeof result === "object" && result && "location" in result) {
      redirect(result.location as string)
    }

    if (typeof result === "string") {
      await setAuthToken(result)
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      await transferCart()

      return null
    }

    return "Unable to start social login."
  } catch (error) {
    if (isNextRedirectError(error)) {
      throw error
    }

    return toErrorMessage(error)
  }
}

export async function loginWithGoogle(
  _currentState: unknown,
  _formData: FormData
) {
  return loginWithOAuthProvider("google")
}

export async function handleOAuthCallback(
  provider: OAuthProvider,
  callbackParams: Record<string, string>
) {
  const sanitizedCallbackParams = callbackParams
  const callbackError =
    sanitizedCallbackParams.error_description || sanitizedCallbackParams.error

  if (callbackError) {
    return callbackError
  }

  if (!sanitizedCallbackParams.code) {
    return "Missing OAuth callback code."
  }

  try {
    const callbackResult = await sdk.auth.callback("customer", provider, {
      ...sanitizedCallbackParams,
    })

    if (typeof callbackResult !== "string" || !callbackResult) {
      return "Invalid authentication token returned from provider."
    }

    const token = callbackResult
    await setAuthToken(token)

    const decodedToken = decodeJwtPayload(token)
    const hasActorId = Boolean(decodedToken?.actor_id)
    const metadataEmail = decodedToken?.user_metadata?.email

    let refreshHeaders: { authorization: string } | undefined = {
      authorization: `Bearer ${token}`,
    }

    if (!hasActorId) {
      if (!metadataEmail) {
        return "Unable to create customer for social login: missing email in provider profile."
      }

      try {
        await sdk.store.customer.create(
          {
            email: metadataEmail,
          },
          {},
          {
            authorization: `Bearer ${token}`,
          }
        )
      } catch (error) {
        return toErrorMessage(error)
      }

      // After customer creation, SDK-auth-managed token/session should already be set.
      // Let refresh use SDK-managed auth first and fallback to callback token if needed.
      refreshHeaders = undefined
    }

    try {
      const refreshedToken = refreshHeaders
        ? await sdk.auth.refresh(refreshHeaders)
        : await sdk.auth.refresh()
      await setAuthToken(refreshedToken)
    } catch {
      if (!refreshHeaders) {
        try {
          const refreshedToken = await sdk.auth.refresh({
            authorization: `Bearer ${token}`,
          })
          await setAuthToken(refreshedToken)
        } catch {
          // Token refresh can fail when provider/session doesn't issue a refreshable token.
          // The callback token is already stored above, so login can still proceed safely.
        }
      }
    }

    const customerCacheTag = await getCacheTag("customers")
    revalidateTag(customerCacheTag)

    await transferCart()

    return null
  } catch (error) {
    return toErrorMessage(error)
  }
}

export async function requestPasswordReset(
  _currentState: unknown,
  formData: FormData
): Promise<ResetPasswordResult> {
  const email = (formData.get("reset_email") as string | null)?.trim()

  if (!email) {
    return {
      success: false,
      message: "Please enter your email address.",
    }
  }

  try {
    await sdk.auth.resetPassword("customer", "emailpass", {
      identifier: email,
    })

    return {
      success: true,
      message:
        "If an account exists with this email, password reset instructions have been sent.",
    }
  } catch (error) {
    if (isProviderMissingError(error)) {
      return {
        success: false,
        message:
          "Password reset is unavailable because email/password auth is not enabled on this backend.",
      }
    }

    return {
      success: false,
      message: "Unable to process password reset request. Please try again.",
    }
  }
}

export async function signout(countryCode: string) {
  await sdk.auth.logout()

  await removeAuthToken()

  const customerCacheTag = await getCacheTag("customers")
  revalidateTag(customerCacheTag)

  await removeCartId()

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)

  redirect(`/${countryCode}/account`)
}

export async function transferCart() {
  const cartId = await getCartId()

  if (!cartId) {
    return
  }

  const headers = await getAuthHeaders()

  await sdk.store.cart.transferCart(cartId, {}, headers)

  const cartCacheTag = await getCacheTag("carts")
  revalidateTag(cartCacheTag)
}

export const addCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const isDefaultBilling = (currentState.isDefaultBilling as boolean) || false
  const isDefaultShipping = (currentState.isDefaultShipping as boolean) || false

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
    phone: formData.get("phone") as string,
    is_default_billing: isDefaultBilling,
    is_default_shipping: isDefaultShipping,
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .createAddress(address, {}, headers)
    .then(async ({ customer }) => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const deleteCustomerAddress = async (
  addressId: string
): Promise<void> => {
  const headers = {
    ...(await getAuthHeaders()),
  }

  await sdk.store.customer
    .deleteAddress(addressId, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

export const updateCustomerAddress = async (
  currentState: Record<string, unknown>,
  formData: FormData
): Promise<any> => {
  const addressId =
    (currentState.addressId as string) || (formData.get("addressId") as string)

  if (!addressId) {
    return { success: false, error: "Address ID is required" }
  }

  const address = {
    first_name: formData.get("first_name") as string,
    last_name: formData.get("last_name") as string,
    company: formData.get("company") as string,
    address_1: formData.get("address_1") as string,
    address_2: formData.get("address_2") as string,
    city: formData.get("city") as string,
    postal_code: formData.get("postal_code") as string,
    province: formData.get("province") as string,
    country_code: formData.get("country_code") as string,
  } as HttpTypes.StoreUpdateCustomerAddress

  const phone = formData.get("phone") as string

  if (phone) {
    address.phone = phone
  }

  const headers = {
    ...(await getAuthHeaders()),
  }

  return sdk.store.customer
    .updateAddress(addressId, address, {}, headers)
    .then(async () => {
      const customerCacheTag = await getCacheTag("customers")
      revalidateTag(customerCacheTag)
      return { success: true, error: null }
    })
    .catch((err) => {
      return { success: false, error: err.toString() }
    })
}

type ConfirmPasswordResetResult = {
  success: boolean
  message: string
}

export async function confirmPasswordReset(
  _currentState: unknown,
  formData: FormData
): Promise<ConfirmPasswordResetResult> {
  const token = formData.get("token") as string
  const password = formData.get("password") as string
  const confirmPassword = formData.get("confirm_password") as string

  if (!token) {
    return { success: false, message: "Invalid or missing reset token." }
  }

  if (!password) {
    return { success: false, message: "Please enter a new password." }
  }

  if (password.length < 8) {
    return { success: false, message: "Password must be at least 8 characters." }
  }

  if (password !== confirmPassword) {
    return { success: false, message: "Passwords do not match." }
  }

  try {
    await sdk.auth.updateProvider("customer", "emailpass", { password }, token)

    return { success: true, message: "Password updated successfully. You can now sign in." }
  } catch (error) {
    const message = toErrorMessage(error)
    if (/expired|invalid.*token|token.*invalid/i.test(message)) {
      return { success: false, message: "This reset link has expired or is invalid. Please request a new one." }
    }
    return { success: false, message: "Unable to update password. Please try again or request a new reset link." }
  }
}
