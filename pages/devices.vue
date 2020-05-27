<template>
  <v-container>
    <v-row>
      <v-col v-for="device in devices" :key="device.id">
        <v-card class="d-flex flex-column" height="100%">
          <v-list>
            <v-list-item>
              <v-list-item-avatar color="blue-grey lighten-5" size="62"
                ><img
                  v-if="device.config"
                  :src="
                    require(`~/assets/${device.config.__typename.toLowerCase()}-logo.png`)
                  "
                  :alt="`${device.config.__typename.toLowerCase()}`"
              /></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="headline">{{
                  device.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  device.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text v-if="device.config" class="d-flex justify-center">
            <v-list
              v-if="device.config.__typename === 'Modbus'"
              style="width: 400px;"
              dense
              class="blue-grey lighten-5"
            >
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Status:</span>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <span class="text-capitalize text-center">{{
                    device.config.status
                  }}</span>
                </v-list-item-content>
                <v-list-item-action
                  ><v-icon
                    v-text="getStatusIcon(device.config.status)"
                  ></v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Host:</span>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <span class="text-center">{{ device.config.host }}</span>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Port:</span>
                </v-list-item-content>
                <v-list-item-content>
                  <span class="text-center">{{ device.config.port }}</span>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right"
                    >Little Endian:</span
                  >
                </v-list-item-content>
                <v-list-item-content>
                  <v-icon left>{{
                    device.config.reverseBits
                      ? 'mdi-checkbox-marked-circle-outline'
                      : 'mdi-circle-off-outline'
                  }}</v-icon>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right"
                    >Reverse Words:</span
                  >
                </v-list-item-content>
                <v-list-item-content>
                  <v-icon>{{
                    device.config.reverseWords
                      ? 'mdi-checkbox-marked-circle-outline'
                      : 'mdi-circle-off-outline'
                  }}</v-icon>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right"
                    >Start at Zero:</span
                  >
                </v-list-item-content>
                <v-list-item-content>
                  <v-icon>{{
                    device.config.zeroBased
                      ? 'mdi-checkbox-marked-circle-outline'
                      : 'mdi-circle-off-outline'
                  }}</v-icon>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Timeout:</span>
                </v-list-item-content>
                <v-list-item-content>
                  <span class="text-center"
                    >{{ device.config.timeout }} ms</span
                  >
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
            </v-list>
            <v-list
              v-if="device.config.__typename === 'EthernetIP'"
              style="width: 400px;"
              dense
              class="blue-grey lighten-5"
            >
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Status:</span>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <span class="text-capitalize text-center">{{
                    device.config.status
                  }}</span>
                </v-list-item-content>
                <v-list-item-action
                  ><v-icon
                    v-text="getStatusIcon(device.config.status)"
                  ></v-icon>
                </v-list-item-action>
              </v-list-item>
              <v-list-item>
                <v-list-item-content>
                  <span class="font-weight-bold text-right">Host:</span>
                </v-list-item-content>
                <v-list-item-content class="align-end">
                  <span class="text-center">{{ device.config.host }}</span>
                </v-list-item-content>
                <v-list-item-action />
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-col>
              <v-btn
                :id="`editDevice${device.id}Button`"
                color="primary"
                block
                @click.stop="openDeviceUpdateDialog(device)"
                ><v-icon left>mdi-pencil</v-icon>edit</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :id="`deleteDevice${device.id}Button`"
                color="primary"
                block
                @click.stop="openDeviceDeleteDialog(device)"
                ><v-icon left>mdi-delete</v-icon>delete</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="deviceCreateDialog" max-width="500px">
      <template v-slot:activator="{ on }">
        <v-btn block outlined color="secondary" v-on="on"
          ><v-icon left>mdi-plus</v-icon>create device</v-btn
        >
      </template>
      <jar-device-form operation="create" @refetch="refetch" />
    </v-dialog>
    <v-dialog v-model="deviceEditDialog" max-width="500px">
      <jar-device-form
        operation="update"
        :initial-data="deviceSelected"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog v-model="deviceDeleteDialog" max-width="500px">
      <jar-device-form
        operation="delete"
        :initial-data="deviceSelected"
        @refetch="refetch"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import graphql from '~/graphql'
import DeviceForm from '~/components/device/Form.vue'

export default {
  components: {
    jarDeviceForm: DeviceForm,
  },
  async asyncData({ app, params }) {
    const provider = app.apolloProvider
    const client = provider.defaultClient
    let error = null
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
      devices,
      error,
    }
  },
  data() {
    return {
      error: null,
      devices: [],
      deviceSelected: null,
      deviceCreateDialog: false,
      deviceEditDialog: false,
      deviceDeleteDialog: false,
    }
  },
  methods: {
    openDeviceUpdateDialog(device) {
      this.deviceSelected = device
      this.deviceEditDialog = true
    },
    openDeviceDeleteDialog(device) {
      this.deviceSelected = device
      this.deviceDeleteDialog = true
    },
    refetch() {
      this.deviceCreateDialog = false
      this.deviceEditDialog = false
      this.deviceDeleteDialog = false
      this.$apollo.queries.devices.refetch()
    },
    getStatusIcon(status) {
      if (status === 'connected') {
        return 'mdi-lan-check'
      } else if (status === 'connecting') {
        return 'mdi-lan-pending'
      } else {
        return 'mdi-lan-disconnect'
      }
    },
  },
  head() {
    return {
      title: 'Devices',
    }
  },
  transition: 'slide-y-transition',
  middleware: 'auth',
  apollo: {
    devices: {
      query: graphql.query.devices,
      subscribeToMore: {
        document: graphql.subscription.deviceUpdate,
      },
    },
  },
}
</script>
