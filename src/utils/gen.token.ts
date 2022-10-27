import jwt from "jsonwebtoken";

//Token generator <string>

function genToken(payload: string) {
  return jwt.sign({ id: payload }, process.env.JWT_SECRET as string, {
    expiresIn: "12h",
  });
}

export default genToken;
