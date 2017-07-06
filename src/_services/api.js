var _api = {};

var dummyUser = {
    token: 'token',
    name: 'username',
    email: 'user@email.com'
}

function _wrap(obj = {}) {
    return new Promise((res, rej) => {
        console.log('REQUEST:', this.type || 'POST', `/api/v2/${this.url || ''}${obj.apiUrl || ''}`);
        console.log('DATA:', !this.noAuth ? Object.assign({}, (delete obj.apiUrl) && obj) : obj);
    
        switch(this.url) {
            case 'users/me':
                res(dummyUser)
                break;

            case 'auth/local':
                res(Object.assign(dummyUser, obj));
                break;
            
            default: 
                rej({error: 401});
        }
    });
}

_api.auth = {
    getToken: () => localStorage.getItem('test-token'),
    setToken: (token) => localStorage.setItem('test-token', token),
    removeToken: (token) => localStorage.removeItem('test-token'),
    login: (user) => {
        return new Promise((resolve, reject) => {
            _wrap.bind({
                    url: 'auth/local',
                    noAuth: true
                })(user)
                .then((data) => {
                    _api.auth.setToken(data.token);
                    resolve(data);
                }, (err) => reject(err))
        });
    },
    createNew: (user) => {
        return new Promise((resolve, reject) => {
            _wrap.bind({
                    url: 'users',
                    noAuth: true
                })(user)
                .then((data) => {
                    _api.auth.setToken(data.token);
                    resolve(data)
                }, (err) => {
                    _api.auth.removeToken();
                    reject(err);
                });
        });
    },
    logout: () => _api.auth.removeToken()
};

_api.getMe = _wrap.bind({ url: 'users/me', type: "GET" });
_api.removeMe = _wrap.bind({ url: 'users', type: "DELETE" });

_api.updateMe = _wrap.bind({ url: 'users', type: "PUT" });
_api.updateToken = _wrap.bind({ url: 'users/token', type: "GET" });
_api.updatePayments = _wrap.bind({ url: 'users/payments', type: "PUT" });
_api.updatePassword = _wrap.bind({ url: 'users/password', type: "PUT" });
_api.updateSettings = _wrap.bind({ url: 'users/settings', type: "PUT" });

_api.getUser = _wrap.bind({ url: 'users/', type: "GET" });
_api.getUsers = _wrap.bind({ url: 'users/list', type: "GET" });

export default _api;
