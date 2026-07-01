// @vitest-environment node
import { test, expect, vi, beforeEach } from "vitest";
import { NextRequest } from "next/server";

const cookieStore = {
  set: vi.fn(),
  get: vi.fn(),
  delete: vi.fn(),
};

vi.mock("server-only", () => ({}));

vi.mock("next/headers", () => ({
  cookies: vi.fn(() => cookieStore),
}));

const { createSession, getSession, deleteSession, verifySession } =
  await import("@/lib/auth");

beforeEach(() => {
  vi.clearAllMocks();
});

test("createSession signs a JWT and sets an httpOnly cookie", async () => {
  await createSession("user-1", "user@example.com");

  expect(cookieStore.set).toHaveBeenCalledTimes(1);
  const [name, token, options] = cookieStore.set.mock.calls[0];

  expect(name).toBe("auth-token");
  expect(typeof token).toBe("string");
  expect(token.split(".")).toHaveLength(3); // JWT format

  expect(options.httpOnly).toBe(true);
  expect(options.sameSite).toBe("lax");
  expect(options.path).toBe("/");
  expect(options.expires).toBeInstanceOf(Date);
});

test("getSession returns null when no cookie is present", async () => {
  cookieStore.get.mockReturnValue(undefined);

  const session = await getSession();

  expect(session).toBeNull();
});

test("getSession returns the decoded payload for a valid token", async () => {
  await createSession("user-1", "user@example.com");
  const token = cookieStore.set.mock.calls[0][1];
  cookieStore.get.mockReturnValue({ value: token });

  const session = await getSession();

  expect(session).not.toBeNull();
  expect(session?.userId).toBe("user-1");
  expect(session?.email).toBe("user@example.com");
});

test("getSession returns null for an invalid token", async () => {
  cookieStore.get.mockReturnValue({ value: "not-a-valid-jwt" });

  const session = await getSession();

  expect(session).toBeNull();
});

test("deleteSession removes the auth cookie", async () => {
  await deleteSession();

  expect(cookieStore.delete).toHaveBeenCalledWith("auth-token");
});

test("verifySession returns null when the request has no cookie", async () => {
  const request = new NextRequest("http://localhost/api/test");

  const session = await verifySession(request);

  expect(session).toBeNull();
});

test("verifySession returns the decoded payload for a valid token", async () => {
  await createSession("user-2", "another@example.com");
  const token = cookieStore.set.mock.calls[0][1];

  const request = new NextRequest("http://localhost/api/test", {
    headers: { cookie: `auth-token=${token}` },
  });

  const session = await verifySession(request);

  expect(session).not.toBeNull();
  expect(session?.userId).toBe("user-2");
  expect(session?.email).toBe("another@example.com");
});

test("verifySession returns null for an invalid token", async () => {
  const request = new NextRequest("http://localhost/api/test", {
    headers: { cookie: "auth-token=garbage.token.value" },
  });

  const session = await verifySession(request);

  expect(session).toBeNull();
});
