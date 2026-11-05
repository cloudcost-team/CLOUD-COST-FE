import { describe, expect, it } from "vitest";
import { getArrowKeyIndex } from "./arrowKeyIndex";

describe("getArrowKeyIndex", () => {
  it.each([
    ["ArrowRight", 1, 2],
    ["ArrowDown", 1, 2],
    ["ArrowLeft", 1, 0],
    ["ArrowUp", 1, 0],
    ["Home", 2, 0],
    ["End", 1, 3],
  ])("%s 키는 현재 %i에서 %i를 돌려준다", (key, index, expected) => {
    expect(getArrowKeyIndex(key, index, 4)).toBe(expected);
  });

  it.each(["ArrowRight", "ArrowDown"])(
    "%s 키는 마지막에서 처음으로 순환한다",
    (key) => {
      expect(getArrowKeyIndex(key, 3, 4)).toBe(0);
    },
  );

  it.each(["ArrowLeft", "ArrowUp"])(
    "%s 키는 처음에서 마지막으로 순환한다",
    (key) => {
      expect(getArrowKeyIndex(key, 0, 4)).toBe(3);
    },
  );

  it.each(["Enter", " ", "Tab", "a", "Escape"])(
    "방향 키가 아닌 %j 키는 null이다",
    (key) => {
      expect(getArrowKeyIndex(key, 1, 4)).toBeNull();
    },
  );
});
