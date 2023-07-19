export type themeType =
  | "Anime"
  | "Minimalist"
  | "Dreamy";


export const themes: themeType[] = [
  "Anime",
  "Minimalist",
  "Dreamy",
];

export const themeToPrompt: { [key: string] : string} = {
  "Anime": "The french countryside, green pastures, lush environment, vivid colors, animation by studio ghibli",
  "Minimalist": "interior of luxury condominium with minimalist furniture and lush house plants and abstract wall paintings | modern architecture by makoto shinkai, ilya kuvshinov, lois van baarle, rossdraws and frank lloyd wright",
  "Dreamy": "outside space, pair of planets on background, vibrant colors, picasso style",
}