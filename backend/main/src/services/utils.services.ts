import bcrypt from 'bcrypt';
export const hash_password = (password: string) => {
    const hashed_password = bcrypt.hashSync(password, 10);
    return hashed_password;
};