const isAuthenticated = (req, res, next) => {
    if (req.session && req.session.user) {
        return next();
    }
    res.redirect('/login');
};

const checkRole = (roles) => {
    return (req, res, next) => {
        if (!req.session.user) {
            return res.redirect('/login');
        }
        
        let idperfil;
        switch(req.session.user.tipo_perfil) {
            case 'admin':
                idperfil = 1;
                break;
            case 'secretaria':
                idperfil = 2;
                break;
            case 'paciente':
                idperfil = 3;
                break;
            default:
                idperfil = 0;
        }
        
        req.session.user.idperfil = idperfil;
        
        if (!roles.includes(idperfil)) {
            console.log('Perfil no autorizado:', idperfil);
            return res.redirect('/');
        }
        next();
    };
};

module.exports = {
    isLoggedIn: isAuthenticated,
    checkRole
}; 