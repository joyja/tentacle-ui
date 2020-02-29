import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Login from '@/components/Login.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('Login', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  test('is a Vue instance', () => {
    const wrapper = mount(Login, {
      localVue,
      vuetify
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
