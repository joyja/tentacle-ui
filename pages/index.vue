<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="primary"
      slider-color="primary"
    >
      <v-tab id="tabTag">
        Tags
      </v-tab>
      <v-tab id="tabScanClass">
        Scan Classes
      </v-tab>
      <v-tabs-items v-model="tab" class="transparent">
        <v-tab-item>
          <v-row class="mb-3">
            <v-col v-for="tag in tagsWithCalcs" :key="tag.id">
              <v-card class="d-flex flex-column" height="100%">
                <v-card-title headline>
                  {{ tag.name }}
                </v-card-title>
                <v-card-subtitle>{{ tag.description }}</v-card-subtitle>
                <v-card-text class="d-flex flex-column justify-end flex-grow-1">
                  <v-row>
                    <v-col>
                      <v-row justify-center no-gutters>
                        <v-col class="text-center">
                          <v-progress-circular
                            v-if="tag.datatype !== 'BOOLEAN'"
                            color="orange darken-2"
                            :rotate="90"
                            :size="100"
                            :width="15"
                            :value="tag.percentage"
                            >{{
                              parseFloat(tag.value).toFixed(2)
                            }}</v-progress-circular
                          >
                          <v-row v-else justify-center>
                            <v-col width="48px">
                              <v-switch
                                v-model="tag.value"
                                class="switch--center"
                                color="orange darken-2"
                                readonly
                                width="48px"
                              ></v-switch>
                            </v-col>
                          </v-row>
                        </v-col>
                      </v-row>
                      <v-row justify-center dense>
                        <v-col class="text-center">
                          <v-tooltip right transition="slide-x-transition">
                            <template v-slot:activator="{ on }">
                              <span v-on="on">
                                Scan Rate: {{ tag.scanClass.rate }} ms
                              </span>
                            </template>
                            <span>{{ tag.scanClass.name }}</span>
                          </v-tooltip>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row no-gutters class="flex-grow-0">
                    <v-col>
                      <v-card outlined>
                        <v-card-title class="subtitle-1">
                          Source
                        </v-card-title>
                        <v-card-text>
                          <v-list
                            v-if="tag.source"
                            flat
                            class="blue-grey lighten-5"
                          >
                            <v-list-item
                              v-if="
                                tag.source &&
                                tag.source.__typename === 'ModbusSource'
                              "
                            >
                              <v-list-item-avatar>
                                <v-icon
                                  :color="
                                    tag.source.modbus.status !== 'connected'
                                      ? 'orange'
                                      : 'primary'
                                  "
                                  v-text="
                                    getDeviceStatusIcon(
                                      tag.source.modbus.status
                                    )
                                  "
                                  >mdi-lan-check</v-icon
                                >
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="tag.source.modbus.device.name"
                                />
                                <v-list-item-subtitle
                                  v-text="tag.source.modbus.device.description"
                                />
                                <v-list-item-subtitle>
                                  <v-row no-gutters>
                                    <v-col>
                                      <strong>Type:</strong>
                                      <span class="text-capitalize">{{
                                        tag.source.registerType
                                          .toLowerCase()
                                          .replace('_', ' ')
                                      }}</span>
                                    </v-col>
                                    <v-col class="ml-3">
                                      <strong>Register:</strong>
                                      {{ tag.source.register }}
                                    </v-col>
                                  </v-row>
                                </v-list-item-subtitle>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-row no-gutters>
                                  <v-col>
                                    <v-btn
                                      :id="`editTagSource${tag.id}Button`"
                                      color="primary"
                                      icon
                                      @click="openDeviceSourceUpdateDialog(tag)"
                                    >
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                  </v-col>
                                  <v-col>
                                    <v-btn
                                      :id="`deleteTagSource${tag.id}Button`"
                                      color="primary"
                                      icon
                                      @click="openDeviceSourceDeleteDialog(tag)"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-list-item-action>
                            </v-list-item>
                            <v-list-item
                              v-else-if="
                                tag.source &&
                                tag.source.__typename === 'EthernetIPSource'
                              "
                            >
                              <v-list-item-avatar>
                                <v-icon
                                  :color="
                                    tag.source.ethernetip.status !== 'connected'
                                      ? 'orange'
                                      : 'primary'
                                  "
                                  v-text="
                                    getDeviceStatusIcon(
                                      tag.source.ethernetip.status
                                    )
                                  "
                                  >mdi-lan-check</v-icon
                                >
                              </v-list-item-avatar>
                              <v-list-item-content>
                                <v-list-item-title
                                  v-text="tag.source.ethernetip.device.name"
                                />
                                <v-list-item-subtitle
                                  v-text="
                                    tag.source.ethernetip.device.description
                                  "
                                />
                                <v-list-item-subtitle>
                                  <v-row no-gutters>
                                    <v-col>
                                      <strong>Tagname:</strong>
                                      <span>{{ tag.source.tagname }}</span>
                                    </v-col>
                                  </v-row>
                                </v-list-item-subtitle>
                              </v-list-item-content>
                              <v-list-item-action>
                                <v-row no-gutters>
                                  <v-col>
                                    <v-btn
                                      :id="`editTagSource${tag.id}Button`"
                                      color="primary"
                                      icon
                                      @click="openDeviceSourceUpdateDialog(tag)"
                                    >
                                      <v-icon>mdi-pencil</v-icon>
                                    </v-btn>
                                  </v-col>
                                  <v-col>
                                    <v-btn
                                      :id="`deleteTagSource${tag.id}Button`"
                                      color="primary"
                                      icon
                                      @click="openDeviceSourceDeleteDialog(tag)"
                                    >
                                      <v-icon>mdi-delete</v-icon>
                                    </v-btn>
                                  </v-col>
                                </v-row>
                              </v-list-item-action>
                            </v-list-item>
                          </v-list>
                          <v-btn
                            v-else
                            :id="`createTagSource${tag.id}Button`"
                            block
                            color="primary"
                            @click="openDeviceSourceCreateDialog(tag)"
                            ><v-icon left>mdi-plus</v-icon>Create Source</v-btn
                          >
                        </v-card-text>
                      </v-card>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-card-actions class="flex-grow-0">
                  <v-col>
                    <v-btn
                      :id="`editTag${tag.id}Button`"
                      color="primary"
                      block
                      @click.stop="openTagUpdateDialog(tag)"
                      ><v-icon left>mdi-pencil</v-icon>edit</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      :id="`deleteTag${tag.id}Button`"
                      color="primary"
                      block
                      @click.stop="openTagDeleteDialog(tag)"
                      ><v-icon left>mdi-delete</v-icon>delete</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-dialog v-model="tagCreateDialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn block outlined color="secondary" v-on="on"
                ><v-icon left>mdi-plus</v-icon>create tag</v-btn
              >
            </template>
            <jar-tag-form
              operation="create"
              :scan-classes="scanClasses"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="tagEditDialog" max-width="500px">
            <jar-tag-form
              operation="update"
              :scan-classes="scanClasses"
              :initial-data="tagSelected"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="tagDeleteDialog" max-width="500px">
            <jar-tag-form
              operation="delete"
              :scan-classes="scanClasses"
              :initial-data="tagSelected"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="deviceSourceCreateDialog" max-width="500px">
            <jar-device-source-form
              operation="create"
              :tag="tagSelected"
              :devices="devices"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="deviceSourceEditDialog" max-width="500px">
            <jar-device-source-form
              operation="update"
              :tag="tagSelected"
              :devices="devices"
              :initial-data="tagSelected && tagSelected.source"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="deviceSourceDeleteDialog" max-width="500px">
            <jar-device-source-form
              operation="delete"
              :tag="tagSelected"
              :devices="devices"
              :initial-data="tagSelected && tagSelected.source"
              @refetch="refetch"
            />
          </v-dialog>
        </v-tab-item>
        <v-tab-item>
          <v-row dense>
            <v-col>
              <v-row>
                <v-col
                  v-for="scanClass in scanClasses"
                  :key="scanClass.id"
                  cols="12"
                >
                  <v-card>
                    <v-card-title headline>
                      {{ scanClass.name }}
                    </v-card-title>
                    <v-card-subtitle>{{
                      scanClass.description
                    }}</v-card-subtitle>
                    <v-card-text class="text-center">
                      <v-row justify-center no-gutters>
                        <v-col>
                          {{ scanClass.rate }} ms
                          <v-progress-linear
                            color="orange"
                            :value="(100 * scanClass.rate) / scanClassMaxRate"
                          ></v-progress-linear>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-col>
                        <v-btn
                          :id="`editScanClass${scanClass.id}Button`"
                          color="primary"
                          block
                          @click.stop="openScanClassUpdateDialog(scanClass)"
                          ><v-icon left>mdi-pencil</v-icon>edit</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          :id="`deleteScanClass${scanClass.id}Button`"
                          color="primary"
                          block
                          @click.stop="openScanClassDeleteDialog(scanClass)"
                          ><v-icon left>mdi-delete</v-icon>delete</v-btn
                        >
                      </v-col>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              <v-dialog v-model="scanClassCreateDialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn block outlined color="secondary" v-on="on"
                    ><v-icon left>mdi-plus</v-icon>create scan class</v-btn
                  >
                </template>
                <jar-scan-class-form operation="create" @refetch="refetch" />
              </v-dialog>
              <v-dialog v-model="scanClassEditDialog" max-width="500px">
                <jar-scan-class-form
                  operation="update"
                  :initial-data="scanClassSelected"
                  @refetch="refetch"
                />
              </v-dialog>
              <v-dialog v-model="scanClassDeleteDialog" max-width="500px">
                <jar-scan-class-form
                  operation="delete"
                  :initial-data="scanClassSelected"
                  @refetch="refetch"
                />
              </v-dialog>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import graphql from '~/graphql'
import ScanClassForm from '~/components/scanclass/Form.vue'
import TagForm from '~/components/tag/Form.vue'
import DeviceSourceForm from '~/components/device/SourceForm.vue'

export default {
  transition: 'slide-y-transition',
  middleware: 'auth',
  components: {
    jarScanClassForm: ScanClassForm,
    jarTagForm: TagForm,
    jarDeviceSourceForm: DeviceSourceForm,
  },
  async asyncData({ app, params }) {
    const provider = app.apolloProvider
    const client = provider.defaultClient
    let error = null
    const tags = await client
      .query({
        query: graphql.query.tags,
      })
      .then(({ data: { tags } }) => {
        return tags
      })
      .catch((e) => {
        error = e
      })
    const scanClasses = await client
      .query({
        query: graphql.query.scanClasses,
      })
      .then(({ data: { scanClasses } }) => {
        return scanClasses
      })
      .catch((e) => {
        error = e
      })
    const devices = await client
      .query({
        query: graphql.query.devices,
      })
      .then(({ data: { devices } }) => {
        return devices
      })
      .catch((e) => {
        error = e
      })
    return {
      tags,
      scanClasses,
      devices,
      error,
    }
  },
  data() {
    return {
      error: null,
      tags: [],
      scanClasses: [],
      devices: [],
      scanClassSelected: null,
      scanClassCreateDialog: false,
      scanClassEditDialog: false,
      scanClassDeleteDialog: false,
      tagSelected: null,
      tagCreateDialog: false,
      tagEditDialog: false,
      tagDeleteDialog: false,
      deviceSourceCreateDialog: false,
      deviceSourceEditDialog: false,
      deviceSourceDeleteDialog: false,
      tab: 0,
    }
  },
  computed: {
    scanClassMaxRate() {
      return this.scanClasses.reduce((a, scanClass) => {
        return scanClass.rate > a ? scanClass.rate : a
      }, 0)
    },
    tagsWithCalcs() {
      return this.tags.map((tag) => {
        const min = tag.min ? tag.min : 0
        const max = tag.max ? tag.max : 100
        const percentage = ((tag.value - min) / (max - min)) * 100
        return {
          ...tag,
          percentage,
          value:
            tag.datatype === `BOOLEAN` ? tag.value + '' === 'true' : tag.value,
        }
      })
    },
  },
  methods: {
    openScanClassUpdateDialog(scanClass) {
      this.scanClassSelected = scanClass
      this.scanClassEditDialog = true
    },
    openScanClassDeleteDialog(scanClass) {
      this.scanClassSelected = scanClass
      this.scanClassDeleteDialog = true
    },
    openTagUpdateDialog(tag) {
      this.tagSelected = tag
      this.tagEditDialog = true
    },
    openTagDeleteDialog(tag) {
      this.tagSelected = tag
      this.tagDeleteDialog = true
    },
    openDeviceSourceCreateDialog(tag) {
      this.tagSelected = tag
      this.deviceSourceCreateDialog = true
    },
    openDeviceSourceUpdateDialog(tag) {
      this.tagSelected = tag
      this.deviceSourceEditDialog = true
    },
    openDeviceSourceDeleteDialog(tag) {
      this.tagSelected = tag
      this.deviceSourceDeleteDialog = true
    },
    refetch() {
      this.scanClassCreateDialog = false
      this.scanClassEditDialog = false
      this.scanClassDeleteDialog = false
      this.tagCreateDialog = false
      this.tagEditDialog = false
      this.tagDeleteDialog = false
      this.deviceSourceCreateDialog = false
      this.deviceSourceEditDialog = false
      this.deviceSourceDeleteDialog = false
      this.$apollo.queries.scanClasses.refetch()
      this.$apollo.queries.tags.refetch()
    },
    getDeviceStatusIcon(status) {
      if (status === 'connected') {
        return 'mdi-lan-check'
      } else if (status === 'connecting') {
        return 'mdi-lan-pending'
      } else {
        return 'mdi-lan-disconnect'
      }
    },
  },
  apollo: {
    scanClasses: {
      query: graphql.query.scanClasses,
    },
    tags: {
      query: graphql.query.tags,
      subscribeToMore: {
        document: graphql.subscription.tagUpdate,
      },
    },
    devices: {
      query: graphql.query.devices,
      subscribeToMore: {
        document: graphql.subscription.deviceUpdate,
      },
    },
  },
}
</script>

<style>
.switch--center > div > div {
  justify-content: center;
}
</style>
