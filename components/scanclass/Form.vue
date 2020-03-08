<template>
  <v-card width="100%" max-width="500px">
    <v-form
      :ref="`scanClass${identifier}Form`"
      v-model="valid"
      class="m-3"
      @submit.prevent="submit"
    >
      <v-card-text v-if="operation !== 'delete'">
        <v-text-field
          :id="`scanClass${identifier}name`"
          v-model="name"
          name="name"
          label="Name"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          :id="`scanClass${identifier}description`"
          v-model="description"
          name="description"
          label="Description"
          :rules="descriptionRules"
        ></v-text-field>
        <v-text-field
          :id="`scanClass${identifier}rate`"
          v-model="rate"
          type="number"
          name="rate"
          label="Rate"
          :rules="rateRules"
        ></v-text-field>
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
          Scan Class
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
      default: 'create'
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
      description: ``,
      descriptionRules: [(v) => !!v || 'description is required'],
      rate: 1000,
      rateRules: [(v) => !!v || 'rate is required'],
      valid: false
    }
  },
  computed: {
    icon() {
      if (this.operation === `create`) {
        return 'mdi-plus'
      } else if (this.operation === `update`) {
        return 'mdi-pencil'
      } else if (this.operation === `delete`) {
        return 'mdi-delete'
      } else {
        return 'mdi-error'
      }
    },
    identifier() {
      return (
        this.operation.charAt(0).toUpperCase() + this.operation.substring(1)
      )
    },
    mutation() {
      if (this.operation === `create`) {
        return graphql.mutation.createScanClass
      } else if (this.operation === `update`) {
        return graphql.mutation.updateScanClass
      } else if (this.operation === `delete`) {
        return graphql.mutation.deleteScanClass
      } else {
        return null
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          name: this.name,
          description: this.description,
          rate: parseInt(this.rate)
        }
      } else if (this.operation === `update`) {
        return {
          id: this.initialData.id,
          name: this.name,
          description: this.description,
          rate: parseInt(this.rate)
        }
      } else if (this.operation === `delete`) {
        return {
          id: this.initialData.id
        }
      } else {
        return null
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
        this.rate = this.initialData.rate
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
