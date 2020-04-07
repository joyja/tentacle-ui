import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import { mockScanClasses, mockTags, mockDevices } from '@/test/mockData'
import index from '@/pages/index.vue'

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
      tags: {
        refetch: jest.fn()
      },
      scanClasses: {
        refetch: jest.fn()
      }
    }
  }
}

describe('Index Page', () => {
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
    wrapper = mount(index, {
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
    app.apolloProvider.defaultClient.query.mockRejectedValueOnce()
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toMatchInlineSnapshot(`
      Object {
        "devices": undefined,
        "error": undefined,
        "scanClasses": undefined,
        "tags": undefined,
      }
    `)
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(3)
  })
  test('asyncData calls client.query and passes appropriate data', async () => {
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        tags: mockTags
      }
    })
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        scanClasses: mockScanClasses
      }
    })
    app.apolloProvider.defaultClient.query.mockResolvedValueOnce({
      data: {
        devices: mockDevices
      }
    })
    const result = await wrapper.vm.$options.asyncData({ app })
    expect(result).toEqual({
      tags: mockTags,
      scanClasses: mockScanClasses,
      devices: mockDevices,
      error: null
    })
    expect(app.apolloProvider.defaultClient.query).toBeCalledTimes(3)
    wrapper.setData(result)
  })
  test(`Clicking the tag edit button sets the show dialog bit and the selected tag ID`, (done) => {
    wrapper.find('#tabTag').trigger('click')
    setTimeout(() => {
      wrapper.find(`#editTag${mockTags[0].id}Button`).trigger('click')
      setTimeout(() => {
        expect(wrapper.vm.tagSelected.id).toBe(mockTags[0].id)
        expect(wrapper.vm.tagEditDialog).toBe(true)
        expect(wrapper.vm.tagDeleteDialog).toBe(false)
        wrapper.setData({ tagEditDialog: false })
        done()
      }, 0)
    }, 0)
  })
  test(`Clicking the tag delete button sets the show dialog bit and the selected tag ID`, (done) => {
    wrapper.find(`#deleteTag${mockTags[1].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.tagSelected.id).toBe(mockTags[1].id)
      expect(wrapper.vm.tagDeleteDialog).toBe(true)
      expect(wrapper.vm.tagEditDialog).toBe(false)
      done()
    }, 0)
  })
  test(`Clicking the scan class edit button sets the show dialog bit and the selected scan class ID`, (done) => {
    wrapper.find('#tabScanClass').trigger('click')
    setTimeout(() => {
      wrapper
        .find(`#editScanClass${mockScanClasses[0].id}Button`)
        .trigger('click')
      setTimeout(() => {
        expect(wrapper.vm.scanClassSelected).toBe(mockScanClasses[0])
        expect(wrapper.vm.scanClassEditDialog).toBe(true)
        expect(wrapper.vm.scanClassDeleteDialog).toBe(false)
        wrapper.setData({ scanClassEditDialog: false })
        done()
      }, 0)
    }, 0)
  })
  test(`Clicking the scan class delete button sets the show dialog bit and the selected scan class ID`, (done) => {
    wrapper
      .find(`#deleteScanClass${mockScanClasses[1].id}Button`)
      .trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.scanClassSelected).toBe(mockScanClasses[1])
      expect(wrapper.vm.scanClassDeleteDialog).toBe(true)
      expect(wrapper.vm.scanClassEditDialog).toBe(false)
      done()
    }, 0)
  })
  test(`Clicking the tag source create button sets the show dialog bit and the selected selectedTag`, (done) => {
    wrapper.find(`#createTagSource${mockTags[1].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.tagSelected).toBe(wrapper.vm.tagsWithCalcs[1])
      expect(wrapper.vm.deviceSourceCreateDialog).toBe(true)
      expect(wrapper.vm.deviceSourceDeleteDialog).toBe(false)
      expect(wrapper.vm.deviceSourceEditDialog).toBe(false)
      wrapper.setData({ deviceSourceCreateDialog: false })
      done()
    }, 0)
  })
  test(`Clicking the tag source edit button sets the show dialog bit and the selected selectedTag`, (done) => {
    wrapper.find(`#editTagSource${mockTags[0].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.tagSelected).toBe(wrapper.vm.tagsWithCalcs[0])
      expect(wrapper.vm.deviceSourceCreateDialog).toBe(false)
      expect(wrapper.vm.deviceSourceDeleteDialog).toBe(false)
      expect(wrapper.vm.deviceSourceEditDialog).toBe(true)
      wrapper.setData({ deviceSourceEditDialog: false })
      done()
    }, 0)
  })
  test(`Clicking the tag source edit button sets the show dialog bit and the selected selectedTag`, (done) => {
    wrapper.find(`#deleteTagSource${mockTags[0].id}Button`).trigger('click')
    setTimeout(() => {
      expect(wrapper.vm.tagSelected).toBe(wrapper.vm.tagsWithCalcs[0])
      expect(wrapper.vm.deviceSourceCreateDialog).toBe(false)
      expect(wrapper.vm.deviceSourceDeleteDialog).toBe(true)
      expect(wrapper.vm.deviceSourceEditDialog).toBe(false)
      wrapper.setData({ deviceSourceDeleteDialog: false })
      done()
    }, 0)
  })
  test(`Refetch calls relevant apollo functions`, () => {
    wrapper.vm.refetch()
    expect(wrapper.vm.scanClassCreateDialog).toBe(false)
    expect(wrapper.vm.scanClassEditDialog).toBe(false)
    expect(wrapper.vm.scanClassDeleteDialog).toBe(false)
    expect(wrapper.vm.tagCreateDialog).toBe(false)
    expect(wrapper.vm.tagEditDialog).toBe(false)
    expect(wrapper.vm.tagDeleteDialog).toBe(false)
    expect(wrapper.vm.deviceSourceCreateDialog).toBe(false)
    expect(wrapper.vm.deviceSourceDeleteDialog).toBe(false)
    expect(wrapper.vm.deviceSourceEditDialog).toBe(false)
    expect(mocks.$apollo.queries.tags.refetch).toBeCalledTimes(1)
    expect(mocks.$apollo.queries.scanClasses.refetch).toBeCalledTimes(1)
  })
})
