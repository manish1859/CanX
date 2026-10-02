const adminrole = async (req, res, next) => {

    if (!req.user) {
        return res.status(401).json({
            success: false,
            message: "User not authenticated"
        })
    }

    if (req.user.role !== 'admin') {
        return res.status(403).json({
            success: false,
            message: 'Only admin can access'
        })
    }

    next()
}

module.exports = adminrole