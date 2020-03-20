<template>
  <v-form
    :ref="`service${identifier}Form`"
    v-model="valid"
    class="m-3"
    @submit.prevent="submit"
  >
    <v-card width="100%" max-width="500px">
      <v-card-text v-if="operation !== 'delete'">
        <v-text-field
          :id="`service${identifier}name`"
          v-model="name"
          name="name"
          label="Name"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          :id="`service${identifier}description`"
          v-model="description"
          name="description"
          label="Description"
          :rules="descriptionRules"
        ></v-text-field>
        <v-switch
          :id="`service${identifier}configEncrypt`"
          v-model="config.encrypt"
          name="encrypt"
          label="Encrypt"
          :rules="configRules.encrypt"
        ></v-switch>
        <v-row no-gutters>
          <v-col class="mr-3">
            <v-text-field
              :id="`service${identifier}confighost`"
              v-model="config.host"
              name="host"
              label="Host"
              :rules="configRules.host"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :id="`service${identifier}configport`"
              v-model="config.port"
              type="number"
              name="port"
              label="Port"
              :rules="configRules.port"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="mr-3">
            <v-text-field
              :id="`service${identifier}configgroup`"
              v-model="config.group"
              name="group"
              label="Group"
              :rules="configRules.group"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :id="`service${identifier}confignode`"
              v-model="config.node"
              name="node"
              label="Node"
              :rules="configRules.node"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-row no-gutters>
          <v-col class="mr-3">
            <v-text-field
              :id="`service${identifier}configusername`"
              v-model="config.username"
              name="username"
              label="Username"
              :rules="configRules.username"
            ></v-text-field>
          </v-col>
          <v-col>
            <v-text-field
              :id="`service${identifier}configpassword`"
              v-model="config.password"
              name="password"
              label="Password"
              :rules="configRules.password"
            ></v-text-field>
          </v-col>
        </v-row>
        <v-text-field
          :id="`service${identifier}configrate`"
          v-model="config.rate"
          type="number"
          name="rate"
          label="Rate"
          :rules="configRules.rate"
        ></v-text-field>
        <v-text-field
          :id="`service${identifier}configRecordLimit`"
          v-model="config.recordLimit"
          type="number"
          name="recordLimit"
          label="Record Limit"
          :rules="configRules.recordLimit"
        ></v-text-field>
        <v-card flat color="blue-grey lighten-5">
          <v-card-title class="subtitle-1">
            Primary Hosts
          </v-card-title>
          <v-card-text>
            <v-list v-if="config.primaryHosts.length > 0">
              <v-list-item
                v-for="(host, index) in config.primaryHosts"
                :key="`primaryHost${index}`"
              >
                <v-list-item-content>
                  <v-text-field
                    v-if="operation === 'create'"
                    :id="`service${identifier}configPrimaryHost${index}`"
                    v-model="config.primaryHosts[index]"
                    :name="`primaryHost${index}`"
                    :label="`Primary Host ${index + 1}`"
                    :rules="configRules.primaryHost"
                  ></v-text-field>
                  <span v-else>{{ host }}</span>
                </v-list-item-content>
                <v-list-item-action v-if="operation === 'create'">
                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="config.primaryHosts.splice(index, 1)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions
            v-if="operation === 'create'"
            class="d-flex justify-center"
          >
            <v-btn
              icon
              color="primary"
              dark
              @click="config.primaryHosts.push('')"
              ><v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-card flat color="blue-grey lighten-5">
          <v-card-title class="subtitle-1">
            Devices
          </v-card-title>
          <v-card-text>
            <v-list v-if="config.devices.length > 0">
              <v-list-item
                v-for="(device, index) in config.devices"
                :key="`device${index}`"
              >
                <v-list-item-content>
                  <v-select
                    v-if="operation === 'create'"
                    :id="`service${identifier}configDevice${index}`"
                    v-model="config.devices[index]"
                    :items="devices"
                    item-text="name"
                    item-value="id"
                    :name="`device${index}`"
                    :label="`Device ${index + 1}`"
                    :rules="configRules.device"
                  ></v-select>
                  <span v-else>{{ device }}</span>
                </v-list-item-content>
                <v-list-item-action v-if="operation === 'create'">
                  <v-btn
                    text
                    icon
                    color="primary"
                    @click="config.devices.splice(index, 1)"
                  >
                    <v-icon>mdi-delete</v-icon>
                  </v-btn>
                </v-list-item-action>
              </v-list-item>
            </v-list>
          </v-card-text>
          <v-card-actions
            v-if="operation === 'create'"
            class="d-flex justify-center"
          >
            <v-btn icon color="primary" dark @click="config.devices.push('')"
              ><v-icon>mdi-plus</v-icon>
            </v-btn>
          </v-card-actions>
        </v-card>
        <v-alert
          transition="scale-transition"
          type="error"
          :value="error !== null"
          width="100%"
          >{{
            error ? error.message.replace('GraphQL error: ', '') : null
          }}</v-alert
        >
      </v-card-text>
      <v-card-text v-else>
        Are you sure you'd like to delete the scan class
        <strong>{{ name }}</strong
        >?
        <v-alert
          transition="scale-transition"
          type="error"
          :value="error !== null"
          width="100%"
          >{{
            error ? error.message.replace('GraphQL error: ', '') : null
          }}</v-alert
        >
      </v-card-text>
      <v-card-actions>
        <v-btn type="submit" block color="primary" :disabled="!valid">
          <v-icon left>{{ icon }}</v-icon>
          {{ identifier }}
          Service
        </v-btn>
      </v-card-actions>
    </v-card>
  </v-form>
</template>

<script>
import graphql from '~/graphql'
export default {
  props: {
    operation: {
      type: String,
      validator: (value) => {
        return value === 'create' || value === 'update' || value === 'delete'
      },
      default: 'create'
    },
    initialData: {
      type: Object,
      required: false,
      default: null
    },
    devices: {
      type: Array,
      required: true
    }
  },
  data() {
    return {
      error: null,
      name: ``,
      nameRules: [(v) => !!v || 'name is required'],
      description: ``,
      descriptionRules: [(v) => !!v || 'description is required'],
      config: {
        host: 'localhost',
        port: 1833,
        group: '',
        node: '',
        username: '',
        password: '',
        rate: 5000,
        encrypt: true,
        recordLimit: 250,
        primaryHosts: [],
        devices: []
      },
      configRules: {
        host: [(v) => !!v || 'host is required'],
        port: [(v) => !!v || 'port is required'],
        group: [(v) => !!v || 'group is required'],
        node: [(v) => !!v || 'node is required'],
        username: [],
        password: [],
        rate: [(v) => !!v || 'rate is required'],
        encrypt: [],
        recordLimit: [(v) => !!v || 'record limit is required.'],
        primaryHost: [
          (v) => !!v || 'invalid primary host name.',
          (v) =>
            this.config.primaryHosts.filter((host) => v === host).length < 2 ||
            "can't have more than one primary host with the same name."
        ],
        device: [
          (v) => !!v || 'a device must be selected.',
          (v) =>
            this.config.devices.filter((device) => v === device).length < 2 ||
            "can't have device assigned more than once."
        ]
      },
      valid: false
    }
  },
  computed: {
    icon() {
      if (this.operation === `create`) {
        return 'mdi-plus'
      } else if (this.operation === `update`) {
        return 'mdi-pencil'
      } else {
        return 'mdi-delete'
      }
    },
    identifier() {
      return (
        this.operation.charAt(0).toUpperCase() + this.operation.substring(1)
      )
    },
    mutation() {
      if (this.operation === `create`) {
        return graphql.mutation.createMqtt
      } else if (this.operation === `update`) {
        return graphql.mutation.updateMqtt
      } else {
        return graphql.mutation.deleteMqtt
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          name: this.name,
          description: this.description,
          host: this.config.host,
          port: parseInt(this.config.port),
          group: this.config.group,
          node: this.config.node,
          username: this.config.username,
          password: this.config.password,
          rate: this.config.rate,
          encrypt: this.config.encrypt,
          recordLimit: this.config.recordLimit,
          primaryHosts: this.config.primaryHosts,
          devices: this.config.devices
        }
      } else if (this.operation === `update`) {
        return {
          id: this.initialData.id,
          name: this.name,
          description: this.description,
          host: this.config.host,
          port: parseInt(this.config.port),
          group: this.config.group,
          node: this.config.node,
          username: this.config.username,
          password: this.config.password,
          rate: this.config.rate,
          encrypt: this.config.encrypt,
          recordLimit: this.config.recordLimit
        }
      } else {
        return {
          id: this.initialData.id
        }
      }
    }
  },
  watch: {
    initialData() {
      this.initializeData()
    }
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    initializeData() {
      if (this.operation !== `create`) {
        this.name = this.initialData.name
        this.description = this.initialData.description
        this.config = {
          host: this.initialData.config.host,
          port: this.initialData.config.port,
          group: this.initialData.config.group,
          node: this.initialData.config.node,
          username: this.initialData.config.username,
          password: this.initialData.config.password,
          rate: this.initialData.config.rate,
          encrypt: this.initialData.config.encrypt,
          recordLimit: this.initialData.config.recordLimit,
          primaryHosts: this.initialData.config.primaryHosts.map(
            (host) => host.name
          ),
          devices: this.initialData.config.sources.map(
            (source) => source.device.id
          )
        }
      }
    },
    async submit() {
      this.error = null
      await this.$apollo
        .mutate({
          mutation: this.mutation,
          variables: this.mutationVariables
        })
        .catch((error) => {
          this.error = error
        })
      if (!this.error) {
        this.$emit('refetch')
      }
    }
  }
}
</script>
