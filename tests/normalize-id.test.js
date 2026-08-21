import { expect, test } from "bun:test"

import { __testing } from "../dist/index.js"

test("normalizeId trims leading and trailing hyphens without regex backtracking risk", () => {
  expect(__testing.normalizeId("---Alpha Beta---")).toBe("alpha-beta")
  expect(__testing.normalizeId("-".repeat(256))).toBe("default")
})

test("normalizeId always produces lowercase for internal slugs", () => {
  expect(__testing.normalizeId("MyDirectory")).toBe("mydirectory")
  expect(__testing.normalizeId("Foo:Bar")).toBe("foo-bar")
  expect(__testing.normalizeId("Git-Branch-v2")).toBe("git-branch-v2")
})

test("sanitizePeerId trims and sanitizes but keeps case", () => {
  expect(__testing.sanitizePeerId(" ---Alpha Beta---  ")).toBe("Alpha-Beta")
  expect(__testing.sanitizePeerId("-".repeat(256))).toBe("default")
})

test("sanitizePeerId preserves case for identity values", () => {
  expect(__testing.sanitizePeerId("MyDirectory")).toBe("MyDirectory")
  expect(__testing.sanitizePeerId("Git-Branch-v2")).toBe("Git-Branch-v2")
  expect(__testing.sanitizePeerId("Foo:Bar")).toBe("Foo-Bar")
})
