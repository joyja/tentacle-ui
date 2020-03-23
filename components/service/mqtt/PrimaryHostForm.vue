<template>
  <v-form
    :ref="`service${identifier}MqttPrimaryHostForm`"
    v-model="valid"
    class="m-3"
    @submit.prevent="submit"
  >
    <v-card width="100%" max-width="500px">
      <v-card-text v-if="operation !== 'delete'">
        <v-text-field
          :id="`primaryHost${identifier}name`"
          v-model="name"
          name="name"
          label="Name"
          :rules="nameRules"
        ></v-text-field>
      </v-card-text>
      <v-card-text v-else>
        Are you sure you'd like to delete the primary host
        <strong>{{ initialData.name }}</strong> from the
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
          Primary Host
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
    initialData: {
      type: Object,
      required: false,
      default: null
    }
  },
  data() {
    return {
      error: null,
      name: ``,
      nameRules: [(v) => !!v || 'name is required'],
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
        return graphql.mutation.addMqttPrimaryHost
      } else {
        return graphql.mutation.deleteMqttPrimaryHost
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          id: this.service.id,
          name: this.name
        }
      } else {
        return {
          id: this.service.id,
          name: this.initialData.name
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
