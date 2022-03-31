import bcrypt from 'bcryptjs'

export const generateHash = (str: string): string => {

    const salt = 10;
    const genSalt = bcrypt.genSaltSync(salt)

    const hash = bcrypt.hashSync(str, genSalt);

    return hash;
}

export const compareHash = (hash: string, str: string): boolean => bcrypt.compareSync(str, hash);