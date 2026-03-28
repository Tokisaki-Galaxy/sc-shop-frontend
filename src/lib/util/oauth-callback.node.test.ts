import assert from "node:assert/strict"
import test from "node:test"
import {
  mapOAuthCallbackErrorMessage,
  sanitizeOAuthCallbackParams,
} from "./oauth-callback.ts"

test("should keep only whitelisted callback params for github", () => {
  const sanitized = sanitizeOAuthCallbackParams("github", {
    code: "abc",
    state: "xyz",
    foo: "bar",
    expires_in: "3600",
    error_description: "",
  })

  assert.deepEqual(sanitized, {
    code: "abc",
    state: "xyz",
  })
})

test("should drop github callback params with blank values", () => {
  const sanitized = sanitizeOAuthCallbackParams("github", {
    code: "abc",
    state: "   ",
    error_description: "   ",
    error: "",
  })

  assert.deepEqual(sanitized, {
    code: "abc",
  })
})

test("should not sanitize callback params for non-github providers", () => {
  const params = {
    code: "abc",
    state: "xyz",
    extra: "value",
  }

  const sanitized = sanitizeOAuthCallbackParams("google", params)

  assert.deepEqual(sanitized, params)
})

test("should map invalid time value error for github", () => {
  const mapped = mapOAuthCallbackErrorMessage(
    "github",
    "SSO login failed: Invalid time value"
  )

  assert.equal(
    mapped,
    "GitHub SSO login failed. Please try again or contact support if the issue persists."
  )
})

test("should not map generic errors for github", () => {
  const input = "Some other error"
  const mapped = mapOAuthCallbackErrorMessage("github", input)

  assert.equal(mapped, input)
})
