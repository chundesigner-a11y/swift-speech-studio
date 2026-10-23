import { matchRoutes } from "react-router-dom";
import { describe, expect, it } from "vitest";

import { routes } from "@/router";

// Match routes without rendering: pages may need Supabase or network the test run lacks.
function leafPath(url: string) {
  return matchRoutes(routes, url)?.at(-1)?.route.path;
}

describe("App routing", () => {
  it.each([
    ["/", "/"],
    ["/sign-in", "/sign-in"],
    ["/sign-up", "/sign-up"],
    ["/app", "/app"],
    ["/auth", "/auth"],
  ])("matches a page for %s", (url, path) => {
    expect(leafPath(url)).toBe(path);
  });

  it("falls back to the not-found page for unknown URLs", () => {
    expect(leafPath("/does-not-exist")).toBe("*");
  });
});
