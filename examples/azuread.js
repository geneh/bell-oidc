'use strict';

// Load modules

const Hapi = require('hapi');
const Hoek = require('hoek');
const Bell = require('../');


const server = new Hapi.Server();
server.connection({ host: 'localhost', port: 4567 });

server.register(Bell, (err) => {

    Hoek.assert(!err, err);

    server.auth.strategy('azure-oidc', 'bell', {
        provider: 'azuread',
        clientId: '',
        clientSecret: '',
        scope: ['openid', 'profile'],
        skipProfile: true
    });

    server.route({
        method: '*',
        path: '/bell/door',
        config: {
            auth: {
                strategy: 'azure-oidc',
                mode: 'try'
            },
            handler: function (request, reply) {

                if (!request.auth.isAuthenticated) {
                    return reply('Authentication failed due to: ' + request.auth.error.message);
                }
                const id_token = request.auth.credentials.id_token;
                let idTokenPayload = new Buffer(id_token.split('.')[1], 'base64').toString('binary');
                idTokenPayload = JSON.parse(idTokenPayload);
                console.log(idTokenPayload);
                reply('<pre>' + JSON.stringify(request.auth.credentials, null, 4) + '</pre>');
            }
        }
    });

    server.start((err) => {

        Hoek.assert(!err, err);
        console.log('Server started at:', server.info.uri);
    });
});
