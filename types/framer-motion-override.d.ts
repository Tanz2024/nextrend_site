// types/framer-motion-override.d.ts
// Proper augmentation: keep all exports (like `motion`), only widen Transition.ease.

export {}; // make this file a module so augmentation merges, not replaces

declare module "framer-motion" {
  type AnyEase =
    | [number, number, number, number]
    | number[]
    | string
    | ((t: number) => number);

  interface Transition {
    ease?: AnyEase | AnyEase[];
  }
}
