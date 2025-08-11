import jwt from "jsonwebtoken";
import userModel from "../models/userModel.js";


export const userAuth = async (req,res,next)=>{
    const {token} = req.cookies;
    
    if(!token){
        return res.json({success:false, message: 'Not Authorized. Login Again'})
    }
        try {
            
            const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

            if(tokenDecode.id){
                if (!req.body) {
                    req.body = {};
                }
                req.body.userId = tokenDecode.id
            }else{
                return res.json({success:false, message: 'Not Authorized. Login Again'})
            }

            next();

        } catch (error) {
            return res.json({success:false, message: error.message})
        }
    
}




export const protectRoute = async (req, res, next) => {
  try {
    const { token } = req.cookies;

    if (!token) {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }

    const tokenDecode = jwt.verify(token, process.env.JWT_SECRET);

    if (tokenDecode.id) {
      const user = await userModel.findById(tokenDecode.id).select("-password");
      if (!user) {
        return res.json({ success: false, message: "User not found" });
      }
      req.user = user;
      next();
    } else {
      return res.json({ success: false, message: "Not Authorized. Login Again" });
    }
  } catch (error) {
    console.log("JWT Error:", error.message);
    return res.json({ success: false, message: "Authentication failed" });
  }
};
