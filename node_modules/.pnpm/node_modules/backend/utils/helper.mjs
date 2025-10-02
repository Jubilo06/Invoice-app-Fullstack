import bcrypt from "bcrypt";

const saltRounds = 10;

//Sync
// export const hashPassword=(password)=>{
//     const salt=bcrypt.genSaltSync(saltRounds)
//     console.log(salt)
//     return bcrypt.hashSync(password, salt)
// }

//Async
export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(saltRounds);
  console.log(salt);
  return bcrypt.hash(password, salt);
};

//sync
// export const comparePassword=(plain, hashed)=>{
//     bcrypt.compareSync(plain, hashed)
// }

//Async
export const comparePassword = async (plain, hashed) => {
  return bcrypt.compare(plain, hashed);
};
