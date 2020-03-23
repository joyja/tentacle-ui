import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mockDevices, mockServices } from '@/test/mockData'
import services from '@/pages/services.vue'

// eliminate vuetify data-app warnings
const el = document.createElement('div')
el.setAttribute('data-app', true)
document.body.appendChild(el)

Vue.use(Vuetify)

const localVue = createLocalVue()

const app = {
  apolloProvider: {
    defaultClient: {
      query: jest.fn()
    }
  }
}

const mocks = {
  $apollo: {
    queries: {
      services: {
        refetch: jest.fn()
      }
    }
  }
}

describe('Services Page', () => {
  let vuetify
  let wrapper
  beforeEach(() => {
    vuetify = new Vuetify()
  })
  afterEach(() => {
    jest.clearAllMocks()
  })
  afterAll(() => {
    wrapper.destroy()
  })
  test('is a Vue instance', () => {
    wrapper = mount(services, {
      localVue,
      vuetify,
      mocks,
      attachToDocument: true
    })
    expect(wrapper.isVueInstance()).toBeTruthy()
  })
  test('asyncData with client.query errors returns and error field', async () => {
    app.apolloProvider.defaultClient.query.mockRejectedValueOnce()
    app.apolloProvider.defaultClient.query.mockRejectedValueOnce()
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "devices": undefined,
        "error": undefined,
        "services": undefined,
      }
    `)
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(2)
  })
  test('asyncData calls client.query and passes appropriate data', async () => {
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        services: mockServices
      }
    })
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        devices: mockDevices
      }
    })
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toEqual({
      devices: mockDevices,
      services: mockServices,
      error: null
    })
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(2)
    wrapper.setData(result)
  })
  test(`Clicking the service edit button sets the show dialog bit and the selected service ID`, (done) => {
    setTimeout(() => {
      wrapper.find(`#editService${mockServices[0].id}Button`).trigger('click')
      setTimeout(() => {
        expect(wrapper.vm.serviceSelected.id).toBe(mockServices[0].id)
        expect(wrapper.vm.serviceEditDialog).toBe(true)
        expect(wrapper.vm.serviceDeleteDialog).toBe(false)
        wrapper.setData({ serviceEditDialog: false })
        done()
      }, 0)
    }, 0)
  })
  test(`Clicking the service delete button sets the show dialog bit and the selected service ID`, (done) => {
    wrapper.find(`#deleteService${mockServices[0].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.serviceSelected.id).toBe(mockServices[0].id)
      expect(wrapper.vm.serviceDeleteDialog).toBe(true)
      expect(wrapper.vm.serviceEditDialog).toBe(false)
      done()
    }, 0)
  })
  test(`Clicking the add primary host button opens the correct dialog and sets the appropriate params`, (done) => {
    wrapper
      .find(`#createPrimaryHost${mockServices[1].id}Button`)
      .trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.serviceSelected.id).toBe(mockServices[1].id)
      expect(wrapper.vm.serviceMqttPrimaryHostCreateDialog).toBe(true)
      expect(wrapper.vm.serviceMqttPrimaryHostDeleteDialog).toBe(false)
      wrapper.setData({ serviceMqttPrimaryHostCreateDialog: false })
      done()
    }, 0)
  })
  test(`Clicking the delete primary host button opens the correct dialog and sets the appropriate params`, (done) => {
    wrapper
      .find(
        `#deletePrimaryHost${mockServices[2].id}Host${mockServices[2].config.primaryHosts[0].id}Button`
      )
      .trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.serviceSelected.id).toBe(mockServices[2].id)
      expect(wrapper.vm.mqttPrimaryHostSelected.id).toBe(
        mockServices[2].config.primaryHosts[0].id
      )
      expect(wrapper.vm.serviceMqttPrimaryHostCreateDialog).toBe(false)
      expect(wrapper.vm.serviceMqttPrimaryHostDeleteDialog).toBe(true)
      wrapper.setData({ serviceMqttPrimaryHostDeleteDialog: false })
      done()
    }, 0)
  })
  test(`Clicking the add source button opens the correct dialog and sets the appropriate params`, (done) => {
    wrapper.find(`#createSource${mockServices[1].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.serviceSelected.id).toBe(mockServices[1].id)
      expect(wrapper.vm.serviceMqttSourceCreateDialog).toBe(true)
      expect(wrapper.vm.serviceMqttSourceDeleteDialog).toBe(false)
      wrapper.setData({ serviceMqttSourceCreateDialog: false })
      done()
    }, 0)
  })
  test(`Clicking the delete source button opens the correct dialog and sets the appropriate params`, (done) => {
    wrapper
      .find(
        `#deleteSource${mockServices[2].id}Source${mockServices[2].config.sources[0].id}Button`
      )
      .trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.serviceSelected.id).toBe(mockServices[2].id)
      expect(wrapper.vm.mqttSourceSelected.id).toBe(
        mockServices[2].config.sources[0].id
      )
      expect(wrapper.vm.serviceMqttSourceCreateDialog).toBe(false)
      expect(wrapper.vm.serviceMqttSourceDeleteDialog).toBe(true)
      wrapper.setData({ serviceMqttSourceDeleteDialog: false })
      done()
    }, 0)
  })
  test(`Refetch calls relevant apollo functions`, () => {
    wrapper.vm.refetch()
    expect(wrapper.vm.serviceCreateDialog).toBe(false)
    expect(wrapper.vm.serviceEditDialog).toBe(false)
    expect(wrapper.vm.serviceDeleteDialog).toBe(false)
    expect(mocks.$apollo.queries.services.refetch).toBeCalledTimes(1)
    wrapper.destroy()
  })
})
