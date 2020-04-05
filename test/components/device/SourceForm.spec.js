import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Form from '@/components/device/SourceForm.vue'
import { mockTags, mockDevices } from '@/test/mockData'
import graphql from '~/graphql'

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)

const mocks = {
  $apollo: {
    mutate: jest.fn()
  }
}

describe('Device Source Form:', () => {
  let vuetify
  const wrapperOptions = {
    localVue,
    mocks,
    propsData: {
      initialData: mockTags[1].source,
      tag: mockTags[1],
      devices: mockDevices
    }
  }
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('is a Vue instance', () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'create'
      }
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  test('Create prop uses create format and submit runs createModbusSource mutation', async () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachToDocument: true,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'create'
      }
    })
    expect(wrapper.vm.identifier).toBe('Create')
    mocks.$apollo.mutate.mockResolvedValueOnce()
    wrapper.find('.v-select').vm.selectItem(mockDevices[0].id)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceSourceCreatemodbusRegisterType').setValue('')
    wrapper.find('#deviceSourceCreatemodbusRegister').setValue('')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper
      .find('#deviceSourceCreatemodbusRegisterType')
      .setValue('HOLDING_REGISTER')
    wrapper.find('#deviceSourceCreatemodbusRegister').setValue(3456)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createModbusSource)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Create prop uses create format and submit runs createEthernIPSource mutation', async () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachToDocument: true,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'create'
      }
    })
    expect(wrapper.vm.identifier).toBe('Create')
    mocks.$apollo.mutate.mockResolvedValueOnce()
    wrapper.find('.v-select').vm.selectItem(mockDevices[1].id)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceSourceCreateethernetipTagname').setValue('')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceSourceCreateethernetipTagname').setValue('aTagname')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createEthernetIPSource)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs update.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachToDocument: true,
      propsData: {
        ...wrapperOptions.propsData,
        tag: mockTags[0],
        initialData: null,
        operation: 'update'
      }
    })
    wrapper.setProps({ initialData: mockTags[0].source })
    await Vue.nextTick()
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateModbusSource)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs update.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachToDocument: true,
      propsData: {
        ...wrapperOptions.propsData,
        tag: mockTags[4],
        initialData: mockTags[4].source,
        operation: 'update'
      }
    })
    await Vue.nextTick()
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateEthernetIPSource)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete prop uses delete format and submit runs delete.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachToDocument: true,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'delete'
      }
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteEthernetIPSource)
    await Vue.nextTick()
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete with rejected error shows error', async () => {
    const error = new Error('A real bad error.')
    mocks.$apollo.mutate.mockRejectedValueOnce(error)
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      propsData: {
        ...wrapperOptions.propsData,
        tag: mockTags[0],
        initialData: mockTags[0].source,
        operation: 'delete'
      }
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteModbusSource)
    wrapper.find('form').trigger('submit')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.error).toBe(error)
    wrapper.destroy()
  })
})
