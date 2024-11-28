const NodeCache = require('node-cache');

// Configuración del caché con tiempo de vida de 5 minutos y chequeo cada 1 minuto
const cache = new NodeCache({ 
    stdTTL: 300,
    checkperiod: 60
});

// Wrapper para funciones de base de datos
const cacheWrapper = {
    async getOrSet(key, fetchFunction, ttl = 300) {
        const value = cache.get(key);
        if (value) {
            return value;
        }

        const result = await fetchFunction();
        cache.set(key, result, ttl);
        return result;
    },

    invalidate(key) {
        cache.del(key);
    }
};

module.exports = cacheWrapper; 