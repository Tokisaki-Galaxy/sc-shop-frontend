import {
  mapOAuthCallbackErrorMessage,
  sanitizeOAuthCallbackParams,
} from "./oauth-callback"

describe("oauth callback utils", () => {
  it("should keep only whitelisted callback params for github", () => {
    const sanitized = sanitizeOAuthCallbackParams("github", {
      code: "abc",
      state: "xyz",
      foo: "bar",
      expires_in: "3600",
      error_description: "",
    })

    expect(sanitized).toEqual({
      code: "abc",
      state: "xyz",
    })
  })

  it("should not sanitize callback params for non-github providers", () => {
    const params = {
      code: "abc",
      state: "xyz",
      extra: "value",
    }

    const sanitized = sanitizeOAuthCallbackParams("google", params)

    expect(sanitized).toEqual(params)
  })

  it("should map invalid time value error for github", () => {
    const mapped = mapOAuthCallbackErrorMessage(
      "github",
      "SSO login failed: Invalid time value"
    )

    expect(mapped).toContain("GitHub SSO login failed due to backend token expiry parsing")
  })

  it("should not map generic errors for github", () => {
    const input = "Some other error"
    const mapped = mapOAuthCallbackErrorMessage("github", input)

    expect(mapped).toBe(input)
  })
})
