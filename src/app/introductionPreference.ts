const INTRODUCTION_KEY = "fitrank.introduction.v1";

export function hasSeenIntroduction(storage?: Pick<Storage, "getItem">): boolean {
  try { return (storage ?? window.localStorage).getItem(INTRODUCTION_KEY) === "complete"; }
  catch { return false; }
}
export function completeIntroduction(storage?: Pick<Storage, "setItem">): boolean {
  try {
    (storage ?? window.localStorage).setItem(INTRODUCTION_KEY, "complete");
    return true;
  } catch { return false; }
}
