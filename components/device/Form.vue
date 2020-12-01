<template>
  <v-card width="100%" max-width="500px">
    <v-form
      :ref="`device${identifier}Form`"
      v-model="valid"
      class="m-3"
      @submit.prevent="submit"
    >
      <v-card-text v-if="operation !== 'delete'">
        <v-text-field
          :id="`device${identifier}name`"
          v-model="name"
          name="name"
          label="Name"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          :id="`device${identifier}description`"
          v-model="description"
          name="description"
          label="Description"
          :rules="descriptionRules"
        ></v-text-field>
        <v-select
          :id="`device${identifier}deviceType`"
          v-model="deviceType"
          :items="deviceTypeItems"
          label="Type"
          :rules="deviceTypeRules"
          @change="typeChange"
        ></v-select>
        <v-expand-transition>
          <div v-if="deviceType === 'Modbus'" key="modbus">
            <v-text-field
              :id="`device${identifier}confighost`"
              v-model="config.host"
              name="host"
              label="Host"
              :rules="configRules.host"
            ></v-text-field>
            <v-text-field
              :id="`device${identifier}configport`"
              v-model="config.port"
              type="number"
              name="port"
              label="Port"
              :rules="configRules.port"
            ></v-text-field>
            <v-switch
              :id="`device${identifier}configReverseBits`"
              v-model="config.reverseBits"
              name="reverseBits"
              label="Little Endian"
              :rules="configRules.reverseBits"
            ></v-switch>
            <v-switch
              :id="`device${identifier}configReverseWords`"
              v-model="config.reverseWords"
              name="reverseWords"
              label="Reverse Words"
              :rules="configRules.reverseWords"
            ></v-switch>
            <v-switch
              :id="`device${identifier}configZeroBased`"
              v-model="config.zeroBased"
              name="zeroBased"
              label="Start at Zero"
              :rules="configRules.zeroBased"
            ></v-switch>
            <v-text-field
              :id="`device${identifier}timeout`"
              v-model="config.timeout"
              type="number"
              name="timeout"
              label="Timeout"
              min="0"
              step="1"
              :rules="configRules.timeout"
            ></v-text-field>
            <v-text-field
              :id="`device${identifier}retryRate`"
              v-model="config.retryRate"
              type="number"
              name="retryRate"
              label="Retry Rate"
              min="0"
              step="1"
              :rules="configRules.retryRate"
            ></v-text-field>
          </div>
          <div v-else-if="deviceType === 'EthernetIP'" key="EthernetIP">
            <v-text-field
              :id="`device${identifier}confighost`"
              v-model="config.host"
              name="host"
              label="Host"
              :rules="configRules.host"
            ></v-text-field>
            <v-text-field
              :id="`device${identifier}configslot`"
              v-model="config.slot"
              type="number"
              name="slot"
              label="Slot"
              :rules="configRules.slot"
            ></v-text-field>
          </div>
          <div v-else-if="deviceType === 'Opcua'" key="Opcua">
            <v-text-field
              :id="`device${identifier}confighost`"
              v-model="config.host"
              name="host"
              label="Host"
              :rules="configRules.host"
            ></v-text-field>
            <v-text-field
              :id="`device${identifier}configport`"
              v-model="config.port"
              type="number"
              name="port"
              label="Port"
              :rules="configRules.port"
            ></v-text-field>
          </div>
          <div v-else key="none" />
        </v-expand-transition>
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
          Device
        </v-btn>
      </v-card-actions>
    </v-form>
  </v-card>
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
      default: 'create',
    },
    initialData: {
      type: Object,
      required: false,
      default: null,
    },
  },
  data() {
    return {
      error: null,
      name: ``,
      nameRules: [(v) => !!v || 'name is required'],
      description: ``,
      descriptionRules: [(v) => !!v || 'description is required'],
      deviceType: null,
      deviceTypeRules: [(v) => !!v || 'type is required'],
      deviceTypeItems: [
        {
          value: 'Modbus',
          text: 'Modbus TCP',
        },
        {
          value: 'EthernetIP',
          text: 'Ethernet/IP',
        },
        {
          value: 'Opcua',
          text: 'OPC UA',
        },
      ],
      config: {},
      configRules: {},
      valid: false,
      configTemplates: {
        Modbus: {
          host: 'localhost',
          port: 502,
          reverseBits: false,
          reverseWords: false,
          zeroBased: false,
          timeout: 1000,
          retryRate: 5000,
        },
        EthernetIP: {
          host: 'localhost',
          slot: 0,
        },
        Opcua: {
          host: 'localhost',
          port: 4840,
        },
      },
      configRulesTemplates: {
        Modbus: {
          host: [(v) => !!v || 'host is required'],
          port: [(v) => !!v || 'port is required'],
          reverseBits: [],
          reverseWords: [],
          zeroBased: [],
          timeout: [(v) => !!v || 'timeout is required'],
          retryRate: [(v) => !!v || 'retry rate is required'],
        },
        EthernetIP: {
          host: [(v) => !!v || 'host is required'],
          slot: [(v) => v === 0 || !!v || 'slot is required'],
        },
        Opcua: {
          host: [(v) => !!v || 'host is required'],
          port: [(v) => !!v || 'port is required'],
        },
      },
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
        if (this.deviceType === 'Modbus') {
          return graphql.mutation.createModbus
        } else if (this.deviceType === 'EthernetIP') {
          return graphql.mutation.createEthernetIP
        } else {
          return graphql.mutation.createOpcua
        }
      } else if (this.operation === `update`) {
        if (this.deviceType === 'Modbus') {
          return graphql.mutation.updateModbus
        } else if (this.deviceType === 'EthernetIP') {
          return graphql.mutation.updateEthernetIP
        } else {
          return graphql.mutation.updateOpcua
        }
      } else if (this.deviceType === 'Modbus') {
        return graphql.mutation.deleteModbus
      } else if (this.deviceType === 'EthernetIP') {
        return graphql.mutation.deleteEthernetIP
      } else {
        return graphql.mutation.deleteOpcua
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        if (this.deviceType === 'Modbus') {
          return {
            name: this.name,
            description: this.description,
            host: this.config.host,
            port: parseInt(this.config.port),
            reverseBits: this.config.reverseBits,
            reverseWords: this.config.reverseWords,
            zeroBased: this.config.zeroBased,
            timeout: this.config.timeout,
            retryRate: this.config.retryRate,
          }
        } else if (this.deviceType === 'EthernetIP') {
          return {
            name: this.name,
            description: this.description,
            host: this.config.host,
            slot: parseInt(this.config.slot),
          }
        } else {
          return {
            name: this.name,
            description: this.description,
            host: this.config.host,
            port: parseInt(this.config.port),
          }
        }
      } else if (this.operation === `update`) {
        if (this.deviceType === 'Modbus') {
          return {
            id: this.initialData.id,
            name: this.name,
            description: this.description,
            host: this.config.host,
            port: parseInt(this.config.port),
            reverseBits: this.config.reverseBits,
            reverseWords: this.config.reverseWords,
            zeroBased: this.config.zeroBased,
            timeout: this.config.timeout,
            retryRate: this.config.retryRate,
          }
        } else if (this.deviceType === 'EthernetIP') {
          return {
            id: this.initialData.id,
            name: this.name,
            description: this.description,
            host: this.config.host,
            slot: parseInt(this.config.slot),
          }
        } else {
          return {
            id: this.initialData.id,
            name: this.name,
            description: this.description,
            host: this.config.host,
            port: parseInt(this.config.port),
          }
        }
      } else {
        return {
          id: this.initialData.id,
        }
      }
    },
  },
  watch: {
    initialData() {
      this.initializeData()
    },
  },
  mounted() {
    this.initializeData()
  },
  methods: {
    typeChange() {
      this.config = this.configTemplates[this.deviceType]
      this.configRules = this.configRulesTemplates[this.deviceType]
    },
    initializeData() {
      if (this.operation !== `create`) {
        this.name = this.initialData.name
        this.description = this.initialData.description
        this.deviceType = this.initialData.config.__typename
        this.config = this.initialData.config
        this.configRules = this.configRulesTemplates[this.deviceType]
      }
    },
    async submit() {
      this.error = null
      await this.$apollo
        .mutate({
          mutation: this.mutation,
          variables: this.mutationVariables,
        })
        .catch((error) => {
          this.error = error
        })
      if (!this.error) {
        this.$emit('refetch')
      }
    },
  },
}
</script>
