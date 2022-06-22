function protectRoutes(req,res,next){
    if(!res.locals.isAuth){
        res.redirect("/401")
    }

    if(req.path.startsWith("/admin")){
        if(!res.locals.isAdmin){
            res.redirect("/403")
        }
    }

    next();
}

module.exports = protectRoutes;