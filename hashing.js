import bcrypt, { compareSync } from "bcrypt"

const saltRounds = 10;

const hashPassword = async (password) => {
    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        console.log("Hashed password: " + hashedPassword);
        return hashedPassword;
    } catch (err) {
        console.error("Hashing password failed: ", err);
    }
}

const verifyPassword = async (password, hashedPassword) => {
    try {
        const match = await bcrypt.compare(password, hashedPassword);
        
        if (match) {
            console.log("Password is correct")
            return true;
        }
        else {
            console.log("Password is incorrect");
            return false;
        }
    } catch (err) {
        console.error("Error verifying password: ", err)
    }
}

export default {hashPassword, verifyPassword}