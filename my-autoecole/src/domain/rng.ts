/* Utilitaires de tirage aléatoire (mélange, échantillon). */

export function shuffle<T>(arr: readonly T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

/** Tire `n` éléments distincts au hasard. */
export function sample<T>(arr: readonly T[], n: number): T[] {
  return shuffle(arr).slice(0, Math.min(n, arr.length));
}

/** Tire `n` éléments distincts excluant ceux qui vérifient `exclude`. */
export function sampleWhere<T>(
  arr: readonly T[],
  n: number,
  exclude: (x: T) => boolean,
): T[] {
  return sample(arr.filter((x) => !exclude(x)), n);
}

export function pickOne<T>(arr: readonly T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

let _id = 0;
export const uid = (prefix = "q") => `${prefix}_${(_id++).toString(36)}`;
