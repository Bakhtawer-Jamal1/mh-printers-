const CREDENTIAL_KEY = 'mh-local-admin-credential-v1'
const FAILURE_KEY = 'mh-local-admin-failures-v1'
const ITERATIONS = 310_000
const MAX_ATTEMPTS = 5
const LOCKOUT_MS = 5 * 60 * 1000

function toBase64(bytes) {
  return btoa(String.fromCharCode(...bytes))
}

function fromBase64(value) {
  return Uint8Array.from(atob(value), (character) => character.charCodeAt(0))
}

async function deriveVerifier(password, salt, iterations = ITERATIONS) {
  if (!globalThis.crypto?.subtle) {
    throw new Error('Secure browser cryptography is unavailable. Open this site on localhost or HTTPS.')
  }
  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits']
  )
  const bits = await crypto.subtle.deriveBits(
    { name: 'PBKDF2', hash: 'SHA-256', salt, iterations },
    key,
    256
  )
  return new Uint8Array(bits)
}

function readCredential() {
  const saved = localStorage.getItem(CREDENTIAL_KEY)
  if (!saved) return null

  const credential = JSON.parse(saved)
  if (
    typeof credential.salt !== 'string' ||
    typeof credential.verifier !== 'string' ||
    !Number.isInteger(credential.iterations) ||
    credential.iterations < 100_000
  ) {
    throw new Error('The saved admin credential is invalid. Clear this browser’s local admin data to set it up again.')
  }
  return credential
}

function readFailureState() {
  const saved = localStorage.getItem(FAILURE_KEY)
  if (!saved) return { attempts: 0, lockedUntil: 0 }

  const state = JSON.parse(saved)
  if (!Number.isInteger(state.attempts) || !Number.isFinite(state.lockedUntil)) {
    throw new Error('The saved sign-in state is invalid. Clear this browser’s local admin data and try again.')
  }
  return state
}

export function hasLocalAdminPassword() {
  return Boolean(localStorage.getItem(CREDENTIAL_KEY))
}

export async function createLocalAdminPassword(password) {
  if (password.length < 12) {
    throw new Error('Use at least 12 characters for the initial local password.')
  }
  if (hasLocalAdminPassword()) {
    throw new Error('An admin password is already set in this browser.')
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const verifier = await deriveVerifier(password, salt)
  localStorage.setItem(CREDENTIAL_KEY, JSON.stringify({
    salt: toBase64(salt),
    verifier: toBase64(verifier),
    iterations: ITERATIONS,
  }))
  localStorage.removeItem(FAILURE_KEY)
}

export async function verifyLocalAdminPassword(password) {
  const lockedUntil = readFailureState().lockedUntil
  if (lockedUntil > Date.now()) {
    return { valid: false, lockedUntil }
  }

  const credential = readCredential()
  if (!credential) return { valid: false, lockedUntil: 0 }

  const verifier = await deriveVerifier(
    password,
    fromBase64(credential.salt),
    credential.iterations
  )
  const expected = fromBase64(credential.verifier)
  let difference = verifier.length ^ expected.length
  for (let index = 0; index < Math.max(verifier.length, expected.length); index += 1) {
    difference |= (verifier[index] ?? 0) ^ (expected[index] ?? 0)
  }
  const matches = difference === 0

  if (matches) {
    localStorage.removeItem(FAILURE_KEY)
    return { valid: true, lockedUntil: 0 }
  }

  const failures = readFailureState()
  const attempts = failures.attempts + 1
  const nextLockedUntil = attempts >= MAX_ATTEMPTS ? Date.now() + LOCKOUT_MS : 0
  localStorage.setItem(FAILURE_KEY, JSON.stringify({
    attempts: nextLockedUntil ? 0 : attempts,
    lockedUntil: nextLockedUntil,
  }))
  return { valid: false, lockedUntil: nextLockedUntil }
}

export async function changeLocalAdminPassword(currentPassword, newPassword) {
  const result = await verifyLocalAdminPassword(currentPassword)
  if (!result.valid) return result
  if (newPassword.length < 12) {
    throw new Error('Use at least 12 characters for a stronger replacement password.')
  }

  const salt = crypto.getRandomValues(new Uint8Array(16))
  const verifier = await deriveVerifier(newPassword, salt)
  localStorage.setItem(CREDENTIAL_KEY, JSON.stringify({
    salt: toBase64(salt),
    verifier: toBase64(verifier),
    iterations: ITERATIONS,
  }))
  localStorage.removeItem(FAILURE_KEY)
  return { valid: true, lockedUntil: 0 }
}
