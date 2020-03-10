import { mount, createLocalVue } from '@vue/test-utils'
import Vue from 'vue'
import Vuetify from 'vuetify'
import Vuex from 'vuex'
import Form from '@/components/tag/Form.vue'
import { mockScanClasses, mockTags } from '@/test/mockData'
import graphql from '~/graphql'

Vue.use(Vuetify)

const localVue = createLocalVue()
localVue.use(Vuex)

const mocks = {
  $apollo: {
    mutate: jest.fn()
  }
}

describe('Tag Form:', () => {
  let vuetify
  const wrapperOptions = {
    localVue,
    mocks,
    propsData: {
      initialData: mockTags[0],
      scanClasses: mockScanClasses
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
    wrapper.find('#tagCreatename').setValue('aTag')
    wrapper.find('#tagCreatedescription').setValue('A really great tag')
    wrapper.find('#tagCreatevalue').setValue(100)
    wrapper.find('#tagCreatedatatype').setValue('FLOAT')
    wrapper.find('#tagCreatescanClass').setValue(1)
    await new Promise((resolve) =>
      setTimeout(() => {
        resolve()
      }, 0)
    )
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.createTag)
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.updateTag)
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteTag)
    await Vue.nextTick()
    expect(wrapper.html()).toMatchInlineSnapshot(`
      "<div class=\\"v-card v-sheet theme--light\\" style=\\"max-width: 500px; width: 100%;\\">
        <form novalidate=\\"novalidate\\" class=\\"v-form m-3\\">
          <div class=\\"v-card__text\\">
            Are you sure you'd like to delete the tag
            <strong>testTag</strong>?
            <div role=\\"alert\\" class=\\"v-alert v-sheet theme--dark error\\" style=\\"width: 100%; display: none;\\">
              <div class=\\"v-alert__wrapper\\"><i aria-hidden=\\"true\\" class=\\"v-icon notranslate v-alert__icon mdi mdi-alert theme--dark\\"></i>
                <div class=\\"v-alert__content\\"></div>
              </div>
            </div>
          </div>
          <div class=\\"v-card__actions\\"><button type=\\"submit\\" class=\\"v-btn v-btn--block v-btn--contained theme--light v-size--default primary\\"><span class=\\"v-btn__content\\"><i aria-hidden=\\"true\\" class=\\"v-icon notranslate v-icon--left mdi mdi-delete theme--light\\"></i>
              Delete
              Tag
            </span></button></div>
        </form>
      </div>"
    `)
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
    expect(wrapper.vm.mutation).toEqual(graphql.mutation.deleteTag)
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
      initialData: mockTags[1]
    })
  })
})
