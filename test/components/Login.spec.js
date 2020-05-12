import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Login from '@/components/Login.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)

const getDiv = function () {
  const div = document.createElement('div')
  document.body.appendChild(div)
  return div
}

const mocks = {
  $apollo: {
    mutate: jest.fn(),
  },
  $apolloHelpers: {
    onLogin: jest.fn(),
    onLogout: jest.fn(),
  },
  $router: {
    push: jest.fn(),
  },
}

const user = {
  id: '1',
  username: 'admin',
}
const token = 'aReallyComplexJwt'

describe('Login', () => {
  let vuetify
  let store
  const mutations = {
    setState: jest.fn(),
  }
  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      mutations,
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('login calls apollo mutate, the onLogin helper, and pushes to index', async (done) => {
    mocks.$apollo.mutate.mockResolvedValueOnce({
      data: { login: { user, token } },
    })
    const wrapper = mount(Login, {
      store,
      localVue,
      vuetify,
      mocks,
      attachTo: getDiv(),
    })
    await Vue.nextTick()
    expect(wrapper.vm.valid).toBe(false)
    expect(
      wrapper.find('.v-card__actions > button').attributes('disabled')
    ).toBe('disabled')
    wrapper.find('#username').setValue('username')
    wrapper.find('#password').setValue('password')
    expect(wrapper.vm.username).toBe('username')
    expect(wrapper.vm.password).toBe('password')
    await Vue.nextTick()
    await Vue.nextTick()
    expect(wrapper.vm.valid).toBe(true)
    expect(
      wrapper.find('.v-card__actions > button').attributes('disabled')
    ).toBe(undefined)
    wrapper.find('.v-card__actions > button').trigger('click')

    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    setTimeout(() => {
      expect(mocks.$apolloHelpers.onLogin).toBeCalledTimes(1)
      expect(mocks.$apolloHelpers.onLogin).toBeCalledWith(token)
      expect(mutations.setState).toBeCalledTimes(1)
      expect(mutations.setState).toBeCalledWith(
        {},
        {
          key: 'user',
          value: user,
        }
      )
      expect(mocks.$router.push).toBeCalledTimes(1)
      expect(mocks.$router.push).toBeCalledWith({
        name: 'index',
      })
      wrapper.destroy()
      done()
    }, 0)
  })
  test('Clicking the show password button changes the password input type', async () => {
    const wrapper = mount(Login, {
      store,
      localVue,
      vuetify,
      mocks,
    })
    expect(wrapper.find('#password').attributes('type')).toBe('password')
    wrapper.find('.v-input__icon--append > button').trigger('click')
    await Vue.nextTick()
    expect(wrapper.find('#password').attributes('type')).toBe('text')
  })
  test('If login mutation errors, the alert component appears with the appropriate text', (done) => {
    mocks.$apollo.mutate.mockRejectedValueOnce()
    const wrapper = mount(Login, {
      store,
      localVue,
      vuetify,
      mocks,
    })
    wrapper.find('form').trigger('submit')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    setTimeout(() => {
      expect(mocks.$apolloHelpers.onLogin).toBeCalledTimes(0)
      expect(mutations.setState).toBeCalledTimes(0)
      expect(mocks.$router.push).toBeCalledTimes(0)
      done()
    }, 0)
  })
})
