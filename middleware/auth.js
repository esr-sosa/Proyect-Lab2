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
        switch(req.session.user.tipo_perfil.toLowerCase()) {
            case 'admin':
                idperfil = 1;
                break;
            case 'medico':
                idperfil = 2;
                break;
            case 'secretaria':
                idperfil = 3;
                break;
            case 'paciente':
                idperfil = 4;
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