module.exports.authenticate = (req, res, next) => {
    const secretKey = process.env.SECRET_KEY || "my_secret_key"
    const authHeader = req.headers.authorization
    const queryKey = req.query.apikey

    if (!authHeader && !queryKey) {
        return res.status(401).json({ message: "Unauthorized: No token provided" })
    }

    const apikey = authHeader ? authHeader.replace("Bearer ", "") : queryKey

    if (apikey !== secretKey) {
        return res.status(403).json({ message: "Forbidden: Invalid token" })
    }

    next()
};
