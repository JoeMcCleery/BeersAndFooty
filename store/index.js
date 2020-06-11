import axios from 'axios'

const mode = process.env.MODE

export const state = () => ({
  page: null,
  api_version: process.env.API_VERSION,
  user: null,
  userVotes: null,
  userAccessToken: null,
  refreshToken: null,
  clientAccessToken: null
})

export const mutations = {
  UPDATE_PAGE(state, pageName) {
    state.page = pageName
  },
  SET_USER(state, user) {
    state.user = user
    if (user.votes) {
      state.userVotes = user.votes
    }
  },
  SET_USER_VOTES(state, votes) {
    state.userVotes = votes
  },
  SET_USER_TOKEN(state, token) {
    state.userAccessToken = token
  },
  SET_REFRESH_TOKEN(state, token) {
    state.refreshToken = token
  },
  SET_CLIENT_TOKEN(state, token) {
    state.clientAccessToken = token
  }
}

export const actions = {
  // nuxtServerInit is called by Nuxt.js before server-rendering every page
  nuxtServerInit({ commit }, { req }) {},

  logout({ commit }, { req }) {
    commit('SET_USER', null)
    commit('SET_USER_TOKEN', null)
    commit('SET_REFRESH_TOKEN', null)
  },

  // eslint-disable-next-line camelcase
  async getClientToken({ commit }, { client_id, client_secret, scope }) {
    const { data } = await axios.post(process.env.API_URL + '/oauth/token', {
      grant_type: 'client_credentials',
      client_id,
      client_secret,
      scope
    })
    if (data.access_token) {
      commit('SET_CLIENT_TOKEN', data.access_token)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  },

  async getUserToken(
    { commit },
    // eslint-disable-next-line camelcase
    { client_id, client_secret, username, password, scope }
  ) {
    const { data } = await axios.post(
      process.env.API_URL + '/oauth/token',
      {
        grant_type: 'password',
        client_id,
        client_secret,
        username,
        password,
        scope
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.state.clientAccessToken
        }
      }
    )
    if (data.access_token && data.refresh_token) {
      commit('SET_USER_TOKEN', data.access_token)
      commit('SET_REFRESH_TOKEN', data.refresh_token)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  },

  async getUser({ commit }) {
    const { data } = await axios.get(
      process.env.API_URL + '/api/' + process.env.API_VERSION + '/user/',
      {
        headers: {
          Authorization: 'Bearer ' + this.state.userAccessToken
        }
      }
    )
    if (data.data && data.data.user) {
      commit('SET_USER', data.data.user)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  },

  async createUser({ commit }, { username, password }) {
    const { data } = await axios.post(
      process.env.API_URL + '/api/' + process.env.API_VERSION + '/users/',
      {
        username,
        password
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.state.clientAccessToken
        }
      }
    )
    if (data.data && data.data.user) {
      commit('SET_USER', data.data.user)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  },

  // eslint-disable-next-line camelcase
  async createVote({ commit }, { review_id, upvote }) {
    const { data } = await axios.post(
      process.env.API_URL + '/api/' + process.env.API_VERSION + '/votes/',
      {
        review_id,
        upvote
      },
      {
        headers: {
          Authorization: 'Bearer ' + this.state.userAccessToken
        }
      }
    )
    if (data.data && data.data.votes) {
      commit('SET_USER_VOTES', data.data.votes)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  },

  // eslint-disable-next-line camelcase
  async deleteVote({ commit }, { voteID }) {
    const { data } = await axios.delete(
      process.env.API_URL +
        '/api/' +
        process.env.API_VERSION +
        '/votes/' +
        voteID,
      {
        headers: {
          Authorization: 'Bearer ' + this.state.userAccessToken
        }
      }
    )
    if (data.data && data.data.votes) {
      commit('SET_USER_VOTES', data.data.votes)
    } else if (data.message && mode === 'dev') {
      throw new Error(data.message)
    }
  }
}
