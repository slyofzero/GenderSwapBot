export const userState: { [key: number]: string } = {};

export interface GenderSwapInput {
  target: number;
  file: string;
}
export const genderSwapInput: { [key: number]: Partial<GenderSwapInput> } = {};
