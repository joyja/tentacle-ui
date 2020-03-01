import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import login from '@/pages/login.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('Login Page', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  test('is a Vue instance', () => {
    const wrapper = mount(login, {
      localVue,
      vuetify
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
