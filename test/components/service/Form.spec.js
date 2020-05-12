import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Form from '@/components/service/Form.vue'
import { mockServices, mockDevices } from '@/test/mockData'
import graphql from '~/graphql'

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
}

describe('Service Form:', () => {
  let vuetify
  const wrapperOptions = {
    localVue,
    mocks,
    propsData: {
      initialData: mockServices[0],
      devices: mockDevices,
    },
  }
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Create prop uses create format and submits with createMqtt.', async () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'create',
      },
    })
    expect(wrapper.vm.identifier).toBe('Create')
    mocks.$apollo.mutate.mockResolvedValueOnce()
    wrapper.find('#serviceCreatename').setValue('aService')
    wrapper.find('#serviceCreatedescription').setValue('A really great service')
    wrapper.find('#serviceCreateconfighost').setValue('')
    wrapper.find('#serviceCreateconfigport').setValue('')
    wrapper.find('#serviceCreateconfigrate').setValue('')
    wrapper.find('#serviceCreateconfigRecordLimit').setValue('')
    await Vue.nextTick()
    // Let vuejs render out the modbus config
    wrapper.find('#serviceCreateconfighost').setValue('localhost')
    wrapper.find('#serviceCreateconfigport').setValue(1883)
    wrapper.find('#serviceCreateconfiggroup').setValue('aGroup')
    wrapper.find('#serviceCreateconfignode').setValue('aNode')
    wrapper.find('#serviceCreateconfigusername').setValue('aUsername')
    wrapper.find('#serviceCreateconfigpassword').setValue('aPassword')
    wrapper.find('#serviceCreateconfigrate').setValue(5000)
    wrapper.find('#serviceCreateconfigRecordLimit').setValue(250)
    wrapper.find('#createServiceAddPrimaryHostButton').trigger('click')
    wrapper.find('#createServiceAddSourceButton').trigger('click')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#serviceCreateconfigPrimaryHost0').setValue('host1')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('.v-select').vm.selectItem('1')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createMqtt)
    wrapper.find('#CreateServiceButton').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs mqtt update.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'update',
      },
    })
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateMqtt)
    wrapper.find('button').trigger('click')
    await Vue.nextTick()
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete prop uses delete format and submit runs delete mqtt.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'delete',
      },
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteMqtt)
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
        operation: 'delete',
      },
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteMqtt)
    wrapper.find('form').trigger('submit')
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.error).toBe(error)
    wrapper.destroy()
  })
  test('Initial data triggers watch.', () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'update',
      },
    })
    wrapper.setProps({
      initialData: mockServices[1],
    })
  })
})
