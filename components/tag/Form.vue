<template>
  <v-card width="100%" max-width="500px">
    <v-form
      :ref="`tag${identifier}Form`"
      v-model="valid"
      class="m-3"
      @submit.prevent="submit"
    >
      <v-card-text v-if="operation !== 'delete'">
        <v-text-field
          :id="`tag${identifier}name`"
          v-model="name"
          name="name"
          label="Name"
          :rules="nameRules"
        ></v-text-field>
        <v-text-field
          :id="`tag${identifier}description`"
          v-model="description"
          name="description"
          label="Description"
          :rules="descriptionRules"
        ></v-text-field>
        <v-text-field
          :id="`tag${identifier}value`"
          v-model="value"
          name="value"
          label="Value"
          :rules="valueRules"
        ></v-text-field>
        <v-select
          :id="`tag${identifier}datatype`"
          v-model="datatype"
          :items="datatypeItems"
          label="Datatype"
        ></v-select>
        <v-select
          :id="`tag${identifier}scanClass`"
          v-model="scanClass"
          :items="scanClassItems"
          label="Scan Class"
        ></v-select>
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
        Are you sure you'd like to delete the tag
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
          Tag
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
    },
    scanClasses: {
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
      value: ``,
      valueRules: [(v) => !!v || 'value is required'],
      datatype: ``,
      datatypeRules: [(v) => !!v || 'datatype is required'],
      datatypeItems: ['BOOLEAN', 'INT16', 'INT32', 'FLOAT'],
      scanClass: null,
      scanClassRules: [(v) => !!v || 'Scan class is required'],
      valid: false
    }
  },
  computed: {
    scanClassItems() {
      return this.scanClasses.map((scanClass) => {
        return {
          value: scanClass.id,
          text: `${scanClass.name} (${scanClass.rate} ms)`
        }
      })
    },
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
        return graphql.mutation.createTag
      } else if (this.operation === `update`) {
        return graphql.mutation.updateTag
      } else if (this.operation === `delete`) {
        return graphql.mutation.deleteTag
      } else {
        return null
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          name: this.name,
          description: this.description,
          datatype: this.datatype,
          scanClassId: this.scanClass,
          value: this.value
        }
      } else if (this.operation === `update`) {
        return {
          id: this.initialData.id,
          name: this.name,
          description: this.description,
          datatype: this.datatype,
          scanClassId: this.scanClass,
          value: this.value
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
        this.datatype = this.initialData.datatype
        this.scanClass = this.initialData.scanClass.id
        this.value = this.initialData.value
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
