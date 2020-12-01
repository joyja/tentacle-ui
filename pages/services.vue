<template>
  <v-container>
    <v-row>
      <v-col v-for="service in services" :key="service.id">
        <v-card class="d-flex flex-column" height="100%">
          <v-list>
            <v-list-item>
              <v-list-item-avatar color="blue-grey lighten-5" size="62"
                ><img :src="require(`~/assets/mqtt-logo.png`)" :alt="`MQTT`"
              /></v-list-item-avatar>
              <v-list-item-content>
                <v-list-item-title class="title">{{
                  service.name
                }}</v-list-item-title>
                <v-list-item-subtitle>{{
                  service.description
                }}</v-list-item-subtitle>
              </v-list-item-content>
            </v-list-item>
          </v-list>
          <v-card-text>
            <v-row>
              <v-col v-if="service.config" class="d-flex justify-center">
                <v-list dense min-width="100%" class="blue-grey lighten-5">
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Encrypt:</span>
                    </v-list-item-content>
                    <v-list-item-content>
                      <v-icon>{{
                        service.config.encrypt
                          ? 'mdi-checkbox-marked-circle-outline'
                          : 'mdi-circle-off-outline'
                      }}</v-icon>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Host:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{ service.config.host }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Port:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{ service.config.port }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Group:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{
                        service.config.group
                      }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Node:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{ service.config.node }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Username:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{
                        service.config.username
                      }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Password:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{
                        service.config.password
                      }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right">Rate:</span>
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center"
                        >{{ service.config.rate }} ms</span
                      >
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                  <v-list-item>
                    <v-list-item-content>
                      <span class="font-weight-bold text-right"
                        >Record Limit:</span
                      >
                    </v-list-item-content>
                    <v-list-item-content class="align-end">
                      <span class="text-center">{{
                        service.config.recordLimit
                      }}</span>
                    </v-list-item-content>
                    <v-list-item-action />
                  </v-list-item>
                </v-list>
              </v-col>
              <v-col v-if="service.config" class="d-flex justify-center">
                <v-card outlined min-width="100%">
                  <v-card-title class="subtitle-1">
                    Primary Hosts
                  </v-card-title>
                  <v-card-text
                    v-for="host in service.config.primaryHosts"
                    :key="host.id"
                    class="d-flex flex-column align-center"
                  >
                    <v-list class="blue-grey lighten-5" min-width="400px">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon
                            :color="
                              host.status !== 'ONLINE' ? 'orange' : 'primary'
                            "
                            v-text="getPrimaryHostStatusIcon(host.status)"
                            >mdi-lan-check</v-icon
                          >
                        </v-list-item-avatar>
                        <v-list-item-content three-line>
                          <v-list-item-title v-text="host.name" />
                          <v-list-item-subtitle>
                            <v-row>
                              <v-col>
                                <strong>Status:</strong>
                                <span class="text-capitalize">{{
                                  host.status.toLowerCase()
                                }}</span>
                              </v-col>
                              <v-col>
                                <strong>Records:</strong> {{ host.recordCount }}
                              </v-col>
                            </v-row>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            :id="`deletePrimaryHost${service.id}Host${host.id}Button`"
                            icon
                            color="primary"
                            @click="
                              openMqttPrimaryHostDeleteDialog(service, host)
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-text>
                    <v-btn
                      :id="`createPrimaryHost${service.id}Button`"
                      fab
                      small
                      absolute
                      bottom
                      right
                      dark
                      color="primary"
                      @click.stop="openMqttPrimaryHostCreateDialog(service)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
              <v-col v-if="service.config" class="d-flex justify-center">
                <v-card outlined min-width="100%">
                  <v-card-title class="subtitle-1"> Devices </v-card-title>
                  <v-card-text
                    v-for="source in service.config.sources"
                    :key="source.device.id"
                    class="d-flex flex-column align-center"
                  >
                    <v-list class="blue-grey lighten-5" min-width="400px">
                      <v-list-item>
                        <v-list-item-avatar>
                          <v-icon
                            :color="
                              source.device.config.status !== 'connected'
                                ? 'orange'
                                : 'primary'
                            "
                            v-text="
                              getDeviceStatusIcon(source.device.config.status)
                            "
                          ></v-icon>
                        </v-list-item-avatar>
                        <v-list-item-content three-line>
                          <v-list-item-title v-text="source.device.name" />
                          <v-list-item-subtitle>
                            <v-row>
                              <v-col>
                                <strong>Status:</strong>
                                <span class="text-capitalize">{{
                                  source.device.config.status
                                }}</span>
                              </v-col>
                            </v-row>
                          </v-list-item-subtitle>
                        </v-list-item-content>
                        <v-list-item-action>
                          <v-btn
                            :id="`deleteSource${service.id}Source${source.id}Button`"
                            icon
                            color="primary"
                            @click.stop="
                              openMqttSourceDeleteDialog(service, source)
                            "
                          >
                            <v-icon>mdi-delete</v-icon>
                          </v-btn>
                        </v-list-item-action>
                      </v-list-item>
                    </v-list>
                  </v-card-text>
                  <v-card-text>
                    <v-btn
                      :id="`createSource${service.id}Button`"
                      fab
                      small
                      absolute
                      bottom
                      right
                      dark
                      color="primary"
                      @click.stop="openMqttSourceCreateDialog(service)"
                    >
                      <v-icon>mdi-plus</v-icon>
                    </v-btn>
                  </v-card-text>
                </v-card>
              </v-col>
            </v-row>
          </v-card-text>
          <v-spacer></v-spacer>
          <v-card-actions>
            <v-col>
              <v-btn
                :id="`editService${service.id}Button`"
                color="primary"
                block
                @click.stop="openServiceUpdateDialog(service)"
                ><v-icon left>mdi-pencil</v-icon>edit</v-btn
              >
            </v-col>
            <v-col>
              <v-btn
                :id="`deleteService${service.id}Button`"
                color="primary"
                block
                @click.stop="openServiceDeleteDialog(service)"
                ><v-icon left>mdi-delete</v-icon>delete</v-btn
              >
            </v-col>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
    <v-dialog v-model="serviceCreateDialog" scrollable max-width="500px">
      <template #activator="{ on }">
        <v-btn block outlined color="secondary" v-on="on"
          ><v-icon left>mdi-plus</v-icon>create service</v-btn
        >
      </template>
      <jar-service-form
        operation="create"
        :devices="devices"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog v-model="serviceEditDialog" scrollable max-width="500px">
      <jar-service-form
        operation="update"
        :devices="devices"
        :initial-data="serviceSelected"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog v-model="serviceDeleteDialog" scrollable max-width="500px">
      <jar-service-form
        operation="delete"
        :devices="devices"
        :initial-data="serviceSelected"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog
      v-model="serviceMqttPrimaryHostCreateDialog"
      scrollable
      max-width="500px"
    >
      <jar-mqtt-primary-host-form
        operation="create"
        :service="serviceSelected"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog
      v-model="serviceMqttPrimaryHostDeleteDialog"
      scrollable
      max-width="500px"
    >
      <jar-mqtt-primary-host-form
        operation="delete"
        :service="serviceSelected"
        :initial-data="mqttPrimaryHostSelected"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog
      v-model="serviceMqttSourceCreateDialog"
      scrollable
      max-width="500px"
    >
      <jar-mqtt-source-form
        operation="create"
        :service="serviceSelected"
        :devices="devices"
        @refetch="refetch"
      />
    </v-dialog>
    <v-dialog
      v-model="serviceMqttSourceDeleteDialog"
      scrollable
      max-width="500px"
    >
      <jar-mqtt-source-form
        operation="delete"
        :service="serviceSelected"
        :devices="devices"
        :initial-data="mqttSourceSelected"
        @refetch="refetch"
      />
    </v-dialog>
  </v-container>
</template>

<script>
import graphql from '~/graphql'
import ServiceForm from '~/components/service/Form.vue'
import MqttPrimaryHostForm from '~/components/service/mqtt/PrimaryHostForm.vue'
import MqttSourceForm from '~/components/service/mqtt/SourceForm.vue'

export default {
  components: {
    jarServiceForm: ServiceForm,
    jarMqttPrimaryHostForm: MqttPrimaryHostForm,
    jarMqttSourceForm: MqttSourceForm,
  },
  middleware: 'auth',
  transition: 'slide-y-transition',
  async asyncData({ app, params }) {
    const provider = app.apolloProvider
    const client = provider.defaultClient
    let error = null
    const services = await client
      .query({
        query: graphql.query.services,
      })
      .then(({ data: { services } }) => {
        return services
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
      services,
      devices,
      error,
    }
  },
  data() {
    return {
      error: null,
      services: [],
      devices: [],
      serviceSelected: null,
      serviceCreateDialog: false,
      serviceEditDialog: false,
      serviceDeleteDialog: false,
      serviceMqttPrimaryHostCreateDialog: false,
      serviceMqttPrimaryHostDeleteDialog: false,
      serviceMqttSourceCreateDialog: false,
      serviceMqttSourceDeleteDialog: false,
      mqttPrimaryHostSelected: null,
      mqttSourceSelected: null,
    }
  },
  head() {
    return {
      title: 'Services',
    }
  },
  methods: {
    openServiceUpdateDialog(service) {
      this.serviceSelected = service
      this.serviceEditDialog = true
    },
    openServiceDeleteDialog(service) {
      this.serviceSelected = service
      this.serviceDeleteDialog = true
    },
    openMqttPrimaryHostCreateDialog(service) {
      this.serviceSelected = service
      this.serviceMqttPrimaryHostCreateDialog = true
    },
    openMqttPrimaryHostDeleteDialog(service, host) {
      this.serviceSelected = service
      this.mqttPrimaryHostSelected = host
      this.serviceMqttPrimaryHostDeleteDialog = true
    },
    openMqttSourceCreateDialog(service) {
      this.serviceSelected = service
      this.serviceMqttSourceCreateDialog = true
    },
    openMqttSourceDeleteDialog(service, source) {
      this.serviceSelected = service
      this.mqttSourceSelected = source
      this.serviceMqttSourceDeleteDialog = true
    },
    refetch() {
      this.serviceCreateDialog = false
      this.serviceEditDialog = false
      this.serviceDeleteDialog = false
      this.serviceMqttPrimaryHostCreateDialog = false
      this.serviceMqttPrimaryHostDeleteDialog = false
      this.serviceMqttSourceCreateDialog = false
      this.serviceMqttSourceDeleteDialog = false
      this.$apollo.queries.services.refetch()
    },
    getPrimaryHostStatusIcon(status) {
      if (status === 'ONLINE') {
        return 'mdi-lan-check'
      } else if (status === 'OFFLINE') {
        return 'mdi-lan-disconnect'
      } else {
        return 'mdi-lan-pending'
      }
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
    services: {
      query: graphql.query.services,
      subscribeToMore: {
        document: graphql.subscription.serviceUpdate,
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
