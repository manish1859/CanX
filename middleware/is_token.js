const jwt = require("jsonwebtoken");
const canxSchema = require("../model/canxSchema");
const canxemployee = require("../model/user");

const is_token = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;
        console.log(authHeader);

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'token mising'
            })
        }
        const token = authHeader.split(" ")[1];

        // console.log("split");
        // console.log("Request Token =>", token);
        // console.log("DB Token =>", user.token);
        // console.log("Equal =>", user.token === token);

        const tokenVerify = await jwt.verify(token, "Seceretkey")
        console.log(tokenVerify);
        if (!tokenVerify) {
            return res.status(401).json({
                success: false,
                message: 'token invalid'
                
            })
        }

        const user = await canxSchema.findById(tokenVerify._id)
        console.log("1111111111", user)
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "user not found"
            })
        }
        // console.log();

        if (user.token !== token) {
            return res.status(401).json({
                success: false,
                message: 'Invalid Session'
            })
        }
        if (user.status === "inactive") {
            return res.status(401).json({
                success: false,
                message: 'Account Inactive'
            })
        }
        req.user = user;
        next()
    } catch (error) {
        console.log('token not access')
        res.status(500).json({
            success:false,
            message:"token not match"
        })
    }

}

module.exports = is_token