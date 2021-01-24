const cookieparser = process.server ? require('cookieparser') : undefined

export const state = () => {
    return {
        user: null
    }
}

export const mutations = {
    setUser (state, payload){
        state.user = payload;
    }
}

export const actions = {
    nuxtServerInit ({ commit }, { req }){
        debugger;
        let user = null;

        if(req.headers.cookie){
            const parsed = cookieparser.parse(req.headers.cookie)

            try {
                user = JSON.parse(parsed.user)
            } catch (error) {
                
            }
        }

        commit('setUser', user)
    }
}