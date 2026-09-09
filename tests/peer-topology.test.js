import { expect, test } from "bun:test"

import { __testing } from "../dist/index.js"

test("root sessions model the user and leave agent observeMe off by default", () => {
  const topology = __testing.buildPeerTopology({
    config: {},
    userPeerId: "user",
    rootAgentPeerId: "opencode",
    activeAgentPeerId: "opencode",
    childAgentPeerId: null,
    parentAgentObserverPeerId: null,
  })

  expect(topology.sessionPeerConfigs).toEqual({
    user: { observeMe: true, observeOthers: false },
    opencode: { observeMe: false, observeOthers: true },
  })
})

test("agentObserveMe true turns on self-observation on the root agent peer", () => {
  const topology = __testing.buildPeerTopology({
    config: { agentObserveMe: true },
    userPeerId: "user",
    rootAgentPeerId: "opencode",
    activeAgentPeerId: "opencode",
    childAgentPeerId: null,
    parentAgentObserverPeerId: null,
  })

  expect(topology.sessionPeerConfigs.opencode.observeMe).toBe(true)
})

test("deriveUserPeerId preserves case for peerName", () => {
  expect(__testing.deriveUserPeerId({ peerName: "Rui", removeUserPrefix: false })).toBe("user-Rui")
  expect(__testing.deriveUserPeerId({ peerName: "Rui", removeUserPrefix: true })).toBe("Rui")
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

test("normalizeId always produces lowercase for internal slugs", () => {
  expect(__testing.normalizeId("MyDirectory")).toBe("mydirectory")
  expect(__testing.normalizeId("Foo:Bar")).toBe("foo-bar")
  expect(__testing.normalizeId("Git-Branch-v2")).toBe("git-branch-v2")
})
