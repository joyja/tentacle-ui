<template>
  <v-card width="100%" max-width="500px">
    <v-form
      :ref="`deviceSource${identifier}Form`"
      v-model="valid"
      class="m-3"
      @submit.prevent="submit"
    >
      <v-card-text v-if="operation !== 'delete'">
        <v-select
          :id="`deviceSource${identifier}device`"
          v-model="deviceId"
          :items="devices"
          item-text="name"
          item-value="id"
          name="device"
          label="Device"
          :rules="deviceRules"
        ></v-select>
        <v-expand-transition>
          <div v-if="device && device.config.__typename === 'Modbus'">
            <v-select
              :id="`deviceSource${identifier}modbusRegisterType`"
              v-model="registerType"
              :items="registerTypeItems"
              name="registerType"
              label="Register Type"
              :rules="registerTypeRules"
            ></v-select>
            <v-text-field
              :id="`deviceSource${identifier}modbusRegister`"
              v-model="register"
              type="number"
              name="register"
              label="Register"
              :rules="registerRules"
            ></v-text-field>
          </div>
          <div v-else-if="device && device.config.__typename === 'EthernetIP'">
            <v-text-field
              :id="`deviceSource${identifier}ethernetipTagname`"
              v-model="tagname"
              name="tagname"
              label="Tagname"
              :rules="tagnameRules"
            ></v-text-field>
          </div>
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
        Are you sure you'd like to delete the the
        <span v-if="tag.source && tag.source.__typename === 'ModbusSource'">
          {{ tag.source ? tag.source.modbus.device.name : '' }} device source
          from <strong>{{ tag.name }}</strong
          >?</span
        >
        <span
          v-else-if="tag.source && tag.source.__typename === 'EthernetIPSource'"
        >
          {{ tag.source ? tag.source.ethernetip.device.name : '' }} device
          source from <strong>{{ tag.name }}</strong
          >?</span
        >
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
          Tag Source
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
        return value === 'create' || value === 'delete' || value === 'update'
      },
      default: 'create'
    },
    tag: {
      type: Object,
      required: true
    },
    devices: {
      type: Array,
      required: true
    },
    initialData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      deviceId: null,
      deviceRules: [(v) => !!v || 'device is required.'],
      register: null,
      registerRules: [(v) => !!v || 'register is required.'],
      registerType: null,
      registerTypeItems: [
        {
          value: 'DISCRETE_INPUT',
          text: 'Discrete Input'
        },
        {
          value: 'COIL',
          text: 'Coil'
        },
        {
          value: 'INPUT_REGISTER',
          text: 'Input Register'
        },
        {
          value: 'HOLDING_REGISTER',
          text: 'Holding Register'
        }
      ],
      registerTypeRules: [(v) => !!v || 'register type is required.'],
      tagname: null,
      tagnameRules: [(v) => !!v || 'tagname is required.'],
      error: null,
      valid: false
    }
  },
  computed: {
    device() {
      return this.devices.find((device) => device.id === this.deviceId)
    },
    icon() {
      if (this.operation === `create`) {
        return 'mdi-plus'
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
        if (this.device && this.device.config.__typename === 'Modbus') {
          return graphql.mutation.createModbusSource
        } else {
          return graphql.mutation.createEthernetIPSource
        }
      } else if (this.operation === `update`) {
        if (this.device && this.device.config.__typename === 'Modbus') {
          return graphql.mutation.updateModbusSource
        } else {
          return graphql.mutation.updateEthernetIPSource
        }
      } else if (this.device && this.device.config.__typename === 'Modbus') {
        return graphql.mutation.deleteModbusSource
      } else {
        return graphql.mutation.deleteEthernetIPSource
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        if (this.device && this.device.config.__typename === 'Modbus') {
          return {
            tagId: this.tag.id,
            deviceId: this.deviceId,
            register: parseInt(this.register),
            registerType: this.registerType
          }
        } else {
          return {
            tagId: this.tag.id,
            deviceId: this.deviceId,
            tagname: this.tagname
          }
        }
      } else if (this.operation === `update`) {
        if (this.device && this.device.config.__typename === 'Modbus') {
          return {
            tagId: this.tag.id,
            register: parseInt(this.register),
            registerType: this.registerType
          }
        } else {
          return {
            tagId: this.tag.id,
            tagname: this.tagname
          }
        }
      } else {
        return {
          tagId: this.tag.id
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
      if (
        this.operation !== `create` &&
        this.initialData &&
        this.initialData.modbus
      ) {
        this.deviceId = this.initialData.modbus.device.id
        this.register = this.initialData.register
        this.registerType = this.initialData.registerType
      }
      if (
        this.operation !== `create` &&
        this.initialData &&
        this.initialData.ethernetip
      ) {
        this.deviceId = this.initialData.ethernetip.device.id
        this.tagname = this.initialData.tagname
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
