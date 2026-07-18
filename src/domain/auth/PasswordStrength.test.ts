import { describe, expect, it } from 'vitest'

import {
  evaluatePasswordStrength,
  meetsMinPasswordStrength,
  passwordStrengthFillCount,
  passwordStrengthLabelKey,
} from '@/domain/auth/PasswordStrength'

describe('evaluatePasswordStrength', () => {
  it('returns empty for blank passwords', () => {
    expect(evaluatePasswordStrength('')).toBe('empty')
  })

  it('returns weak when length or character variety is insufficient', () => {
    expect(evaluatePasswordStrength('short')).toBe('weak')
    expect(evaluatePasswordStrength('alllowercase1!')).toBe('weak')
    expect(evaluatePasswordStrength('ALLUPPERCASE1!')).toBe('weak')
    expect(evaluatePasswordStrength('NoDigitsHere!')).toBe('weak')
    expect(evaluatePasswordStrength('NoSymbolHere1')).toBe('weak')
    expect(evaluatePasswordStrength('Ab1!xyz')).toBe('weak')
  })

  it('returns medium for 8–11 chars with upper, lower, digit, and symbol', () => {
    expect(evaluatePasswordStrength('Abcd123!')).toBe('medium')
    expect(evaluatePasswordStrength('Abcdef12!@#')).toBe('medium')
  })

  it('returns strong for 12+ chars with upper, lower, digit, and symbol', () => {
    expect(evaluatePasswordStrength('Abcdefgh12!@')).toBe('strong')
    expect(evaluatePasswordStrength('Str0ng!Passw0rd')).toBe('strong')
  })
})

describe('meetsMinPasswordStrength', () => {
  it('rejects empty and weak passwords', () => {
    expect(meetsMinPasswordStrength('')).toBe(false)
    expect(meetsMinPasswordStrength('password')).toBe(false)
    expect(meetsMinPasswordStrength('Ab1!xyz')).toBe(false)
  })

  it('accepts medium and strong passwords', () => {
    expect(meetsMinPasswordStrength('Abcd123!')).toBe(true)
    expect(meetsMinPasswordStrength('Abcdefgh12!@')).toBe(true)
  })
})

describe('passwordStrengthFillCount', () => {
  it('maps strength levels to meter fill segments', () => {
    expect(passwordStrengthFillCount('empty')).toBe(0)
    expect(passwordStrengthFillCount('weak')).toBe(1)
    expect(passwordStrengthFillCount('medium')).toBe(2)
    expect(passwordStrengthFillCount('strong')).toBe(3)
  })
})

describe('passwordStrengthLabelKey', () => {
  it('returns i18n keys for each strength level', () => {
    expect(passwordStrengthLabelKey('empty')).toBe(
      'auth.passwordStrength.empty',
    )
    expect(passwordStrengthLabelKey('weak')).toBe('auth.passwordStrength.weak')
    expect(passwordStrengthLabelKey('medium')).toBe(
      'auth.passwordStrength.medium',
    )
    expect(passwordStrengthLabelKey('strong')).toBe(
      'auth.passwordStrength.strong',
    )
  })
})
