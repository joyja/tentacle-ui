<template>
  <v-form
    :ref="`service${identifier}MqttDeviceForm`"
    v-model="valid"
    class="m-3"
    @submit.prevent="submit"
  >
    <v-card width="100%" max-width="500px">
      <v-card-text v-if="operation !== 'delete'">
        <v-select
          v-if="operation === 'create'"
          :id="`service${identifier}configDevice`"
          v-model="selectedDevice"
          :items="devices"
          item-text="name"
          item-value="id"
          name="device"
          label="Device"
          :rules="rules"
        ></v-select>
      </v-card-text>
      <v-card-text v-else>
        Are you sure you'd like to remove the device
        <strong>{{ initialData.device.name }}</strong> from the
        <strong>{{ service.name }}</strong> service?
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
          Device Source
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
        return value === 'create' || value === 'delete'
      },
      default: 'create'
    },
    service: {
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
      selectedDevice: null,
      rules: [
        (v) => !!v || 'device is required.',
        (v) =>
          !this.service.config.sources.some(
            (source) => source.device.id === v
          ) || 'cannot add a device that has already been added.'
      ],
      error: null,
      valid: false
    }
  },
  computed: {
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
        return graphql.mutation.addMqttSource
      } else {
        return graphql.mutation.deleteMqttSource
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          id: this.service.id,
          deviceId: this.selectedDevice
        }
      } else {
        return {
          id: this.service.id,
          deviceId: this.initialData.device.id
        }
      }
    }
  },
  methods: {
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
