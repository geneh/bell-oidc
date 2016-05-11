'use strict';

exports = module.exports = function (options) {

    return {
        protocol: 'oauth2',
        useParamsAuth: true,
        auth: 'https://login.microsoftonline.com/common/oauth2/authorize',
        token: 'https://login.microsoftonline.com/common/oauth2/token',
        scope: ['openid', 'profile'],
        profile: (credentials, params, get, reply) => {

            get('https://login.microsoftonline.com/common/openid/userinfo', null, (profile) => {

                credentials.profile = profile;
                return reply();
            });
        }
    };
};
