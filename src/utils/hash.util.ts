import bcrypt from "bcryptjs";

export const generateHash = async (str: string): Promise<string> => {
  const genSalt = await bcrypt.genSalt(10);
  return await bcrypt.hash(str, genSalt);
};

export const compareHash = async (
  hash: string,
  str: string
): Promise<boolean> => await bcrypt.compare(str, hash);
