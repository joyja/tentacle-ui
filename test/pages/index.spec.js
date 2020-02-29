import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import index from '@/pages/index.vue'

Vue.use(Vuetify)

const localVue = createLocalVue()

describe('Index Page', () => {
  let vuetify
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  test('is a Vue instance', () => {
    const wrapper = mount(index, {
      localVue,
      vuetify
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
})
