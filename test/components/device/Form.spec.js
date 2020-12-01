import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Form from '@/components/device/Form.vue'
import { mockDevices } from '@/test/mockData'
import graphql from '~/graphql'

Vue.use(Vuetify)

const getDiv = function () {
  const div = document.createElement('div')
  document.body.appendChild(div)
  return div
}

const localVue = createLocalVue()
localVue.use(Vuex)

const mocks = {
  $apollo: {
    mutate: jest.fn(),
  },
}

describe('Device Form:', () => {
  let vuetify
  const wrapperOptions = {
    localVue,
    mocks,
    propsData: {
      initialData: mockDevices[0],
    },
  }
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  test('Create prop uses create format and submit with modbus type runs createModbus.', async () => {
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
    wrapper.find('#deviceCreatename').setValue('adevice')
    wrapper.find('#deviceCreatedescription').setValue('A really great device')
    wrapper.find('.v-select').vm.selectItem('Modbus')
    // Let vuejs render out the modbus config
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceCreateconfighost').setValue('')
    wrapper.find('#deviceCreateconfigport').setValue('')
    wrapper.find('#deviceCreatetimeout').setValue('')
    wrapper.find('#deviceCreateretryRate').setValue('')
    await Vue.nextTick()
    wrapper.find('#deviceCreateconfighost').setValue('localhost')
    wrapper.find('#deviceCreateconfigport').setValue(502)
    wrapper.find('#deviceCreateconfigReverseBits').setChecked(true)
    wrapper.find('#deviceCreateconfigReverseWords').setChecked(true)
    wrapper.find('#deviceCreateconfigZeroBased').setChecked(true)
    wrapper.find('#deviceCreatetimeout').setValue(6000)
    wrapper.find('#deviceCreateretryRate').setValue(10000)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createModbus)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Create prop uses create format and submit with ethernetip type runs createEthernetIP.', async () => {
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
    wrapper.find('#deviceCreatename').setValue('adevice')
    wrapper.find('#deviceCreatedescription').setValue('A really great device')
    wrapper.find('.v-select').vm.selectItem('EthernetIP')
    // Let vuejs render out the modbus config
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceCreateconfighost').setValue('')
    wrapper.find('#deviceCreateconfigslot').setValue('')
    await Vue.nextTick()
    wrapper.find('#deviceCreateconfighost').setValue('localhost')
    wrapper.find('#deviceCreateconfigslot').setValue(1)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createEthernetIP)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Create prop uses create format and submit with opcua type runs createOpcua.', async () => {
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
    wrapper.find('#deviceCreatename').setValue('adevice')
    wrapper.find('#deviceCreatedescription').setValue('A really great device')
    wrapper.find('.v-select').vm.selectItem('Opcua')
    // Let vuejs render out the modbus config
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    wrapper.find('#deviceCreateconfighost').setValue('')
    wrapper.find('#deviceCreateconfigport').setValue('')
    await Vue.nextTick()
    wrapper.find('#deviceCreateconfighost').setValue('localhost')
    wrapper.find('#deviceCreateconfigport').setValue(1)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createOpcua)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs modbus update.', async () => {
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateModbus)
    wrapper.find('button').trigger('click')
    await Vue.nextTick()
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs ethernet IP update.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        initialData: mockDevices[1],
        operation: 'update',
      },
    })
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateEthernetIP)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Update prop uses update format and submit runs Opcua update.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        initialData: mockDevices[4],
        operation: 'update',
      },
    })
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateOpcua)
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete prop uses delete format and submit runs delete.', async () => {
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteModbus)
    await Vue.nextTick()
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete prop uses delete format and submit runs delete.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        initialData: mockDevices[1],
        operation: 'delete',
      },
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteEthernetIP)
    await Vue.nextTick()
    wrapper.find('button').trigger('click')
    expect(mocks.$apollo.mutate).toBeCalledTimes(1)
    wrapper.destroy()
  })
  test('Delete prop uses delete format and submit runs delete.', async () => {
    mocks.$apollo.mutate.mockResolvedValueOnce({})
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      attachTo: getDiv(),
      propsData: {
        ...wrapperOptions.propsData,
        initialData: mockDevices[4],
        operation: 'delete',
      },
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteOpcua)
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteModbus)
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
      initialData: mockDevices[1],
    })
  })
})
