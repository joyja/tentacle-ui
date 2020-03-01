import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Login from '@/components/Login.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)

const mocks = {
  $apollo: {
    mutate: jest.fn()
  },
  $apolloHelpers: {
    onLogin: jest.fn(),
    onLogout: jest.fn()
  },
  $router: {
    push: jest.fn()
  }
}

const user = {
  id: '1',
  username: 'admin'
}
const token = 'aReallyComplexJwt'

describe('Login', () => {
  let vuetify
  let store
  const mutations = {
    setState: jest.fn()
  }
  beforeEach(() => {
    vuetify = new Vuetify()
    store = new Vuex.Store({
      mutations
    })
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('is a Vue instance', () => {
    const wrapper = mount(Login, {
      store,
      localVue,
      vuetify
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  test('login calls apollo mutate, the onLogin helper, and pushes to index', async (done) => {
    mocks.$apollo.mutate.mockResolvedValueOnce({
      data: { login: { user, token } }
    })
    const wrapper = mount(Login, {
      store,
      localVue,
      vuetify,
      mocks,
      attachToDocument: true
    })
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class=\\"d-flex flex-column align-center\\" style=\\"min-width: 400px;\\">
        <div class=\\"mb-3 v-card v-sheet theme--light\\" style=\\"width: 100%;\\">
          <form novalidate=\\"novalidate\\" class=\\"v-form m-3\\">
            <div class=\\"v-card__text\\">
              <div class=\\"v-input theme--light v-text-field\\">
                <div class=\\"v-input__control\\">
                  <div class=\\"v-input__slot\\">
                    <div class=\\"v-text-field__slot\\"><label for=\\"username\\" class=\\"v-label theme--light\\" style=\\"left: 0px; position: absolute;\\">Username</label><input name=\\"username\\" id=\\"username\\" type=\\"text\\"></div>
                  </div>
                  <div class=\\"v-text-field__details\\">
                    <div class=\\"v-messages theme--light\\">
                      <div class=\\"v-messages__wrapper\\"></div>
                    </div>
                  </div>
                </div>
              </div>
              <div class=\\"v-input theme--light v-text-field\\">
                <div class=\\"v-input__control\\">
                  <div class=\\"v-input__slot\\">
                    <div class=\\"v-text-field__slot\\"><label for=\\"password\\" class=\\"v-label theme--light\\" style=\\"left: 0px; position: absolute;\\">Password</label><input name=\\"password\\" id=\\"password\\" type=\\"password\\"></div>
                    <div class=\\"v-input__append-inner\\">
                      <div class=\\"v-input__icon v-input__icon--append\\"><button type=\\"button\\" aria-label=\\"append icon\\" class=\\"v-icon notranslate v-icon--link mdi mdi-eye-off theme--light\\"></button></div>
                    </div>
                  </div>
                  <div class=\\"v-text-field__details\\">
                    <div class=\\"v-messages theme--light\\">
                      <div class=\\"v-messages__wrapper\\"></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div class=\\"v-card__actions\\"><button type=\\"submit\\" disabled=\\"disabled\\" class=\\"v-btn v-btn--block v-btn--contained v-btn--disabled theme--light v-size--default\\"><span class=\\"v-btn__content\\">Login</span></button></div>
          </form>
        </div>
        <div role=\\"alert\\" class=\\"v-alert v-sheet theme--dark error\\" style=\\"width: 100%; display: none;\\">
          <div class=\\"v-alert__wrapper\\"><i aria-hidden=\\"true\\" class=\\"v-icon notranslate v-alert__icon mdi mdi-alert theme--dark\\"></i>
            <div class=\\"v-alert__content\\"></div>
          </div>
        </div>
      </div>"
    `)
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
          value: user
        }
      )
      expect(mocks.$router.push).toBeCalledTimes(1)
      expect(mocks.$router.push).toBeCalledWith({
        name: 'index'
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
      mocks
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
      mocks
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
