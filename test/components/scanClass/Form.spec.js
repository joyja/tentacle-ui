import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Form from '@/components/scanclass/Form.vue'
import { mockScanClasses } from '@/test/mockData'
import graphql from '~/graphql'

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)

const mocks = {
  $apollo: {
    mutate: jest.fn()
  }
}

describe('Scan Class Form:', () => {
  let vuetify
  const wrapperOptions = {
    localVue,
    mocks,
    propsData: {
      initialData: mockScanClasses[0]
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
  test('Create prop uses create format and submit runs create.', async () => {
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
    wrapper.find('#scanClassCreatename').setValue('aScanclass')
    wrapper
      .find('#scanClassCreatedescription')
      .setValue('A really great scanclass')
    wrapper.find('#scanClassCreaterate').setValue(1000)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createScanClass)
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
        operation: 'update'
      }
    })
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.identifier).toBe('Update')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateScanClass)
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteScanClass)
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
        operation: 'delete'
      }
    })
    expect(wrapper.vm.identifier).toBe('Delete')
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteScanClass)
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
        operation: 'update'
      }
    })
    wrapper.setProps({
      initialData: mockScanClasses[1]
    })
  })
  test('Set rate to null makes form invalid.', async () => {
    const wrapper = mount(Form, {
      ...wrapperOptions,
      vuetify,
      propsData: {
        ...wrapperOptions.propsData,
        operation: 'create'
      }
    })
    wrapper.find('#scanClassCreaterate').setValue(null)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.valid).toBe(false)
  })
})
