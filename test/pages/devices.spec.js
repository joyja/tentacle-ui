import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mockDevices } from '@/test/mockData'
import devices from '@/pages/devices.vue'

// eliminate vuetify data-app warnings
const el = document.createElement('div')
el.setAttribute('data-app', true)
document.body.appendChild(el)

const getDiv = function () {
  const div = document.createElement('div')
  document.body.appendChild(div)
  return div
}

Vue.use(Vuetify)

const localVue = createLocalVue()

const app = {
  apolloProvider: {
    defaultClient: {
      query: jest.fn(),
    },
  },
}

const mocks = {
  $apollo: {
    queries: {
      devices: {
        refetch: jest.fn(),
      },
    },
  },
}

describe('Devices Page', () => {
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
  test('Title is correct.', () => {
    wrapper = mount(devices, {
      localVue,
      vuetify,
      mocks,
      attachTo: getDiv(),
    })
    expect(wrapper.vm.$options.head().title).toBe('Devices')
  })
  test('asyncData with client.query errors returns and error field', async () => {
    app.apolloProvider.defaultClient.query.mockRejectedValueOnce()
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "devices": undefined,
        "error": undefined,
      }
    `)
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(1)
  })
  test('asyncData calls client.query and passes appropriate data', async () => {
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        devices: mockDevices,
      },
    })
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toEqual({
      devices: mockDevices,
      error: null,
    })
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(1)
    wrapper.setData(result)
  })
  test(`Clicking the device edit button sets the show dialog bit and the selected device ID`, (done) => {
    setTimeout(() => {
      wrapper.find(`#editDevice${mockDevices[0].id}Button`).trigger('click')
      setTimeout(() => {
        expect(wrapper.vm.deviceSelected.id).toBe(mockDevices[0].id)
        expect(wrapper.vm.deviceEditDialog).toBe(true)
        expect(wrapper.vm.deviceDeleteDialog).toBe(false)
        wrapper.setData({ deviceEditDialog: false })
        done()
      }, 0)
    }, 0)
  })
  test(`Clicking the device delete button sets the show dialog bit and the selected device ID`, (done) => {
    wrapper.find(`#deleteDevice${mockDevices[1].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.deviceSelected.id).toBe(mockDevices[1].id)
      expect(wrapper.vm.deviceDeleteDialog).toBe(true)
      expect(wrapper.vm.deviceEditDialog).toBe(false)
      done()
    }, 0)
  })
  test(`Refetch calls relevant apollo functions`, () => {
    wrapper.vm.refetch()
    expect(wrapper.vm.deviceCreateDialog).toBe(false)
    expect(wrapper.vm.deviceEditDialog).toBe(false)
    expect(wrapper.vm.deviceDeleteDialog).toBe(false)
    expect(mocks.$apollo.queries.devices.refetch).toBeCalledTimes(1)
  })
})
