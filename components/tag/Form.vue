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
        <v-text-field
          :id="`tag${identifier}min`"
          v-model="min"
          type="number"
          name="min"
          label="Minimum"
          :rules="minRules"
        ></v-text-field>
        <v-text-field
          :id="`tag${identifier}max`"
          v-model="max"
          type="number"
          name="max"
          label="Maximum"
          :rules="maxRules"
        ></v-text-field>
        <v-text-field
          :id="`tag${identifier}deadband`"
          v-model="deadband"
          type="number"
          name="deadband"
          label="Deadband"
          :rules="deadbandRules"
        ></v-text-field>
        <v-select
          :id="`tag${identifier}datatype`"
          v-model="datatype"
          :items="datatypeItems"
          label="Datatype"
          :rules="datatypeRules"
        ></v-select>
        <v-select
          :id="`tag${identifier}scanClass`"
          v-model="scanClass"
          :items="scanClassItems"
          label="Scan Class"
          :rules="scanClassRules"
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
      default: 'create',
    },
    initialData: {
      type: Object,
      required: false,
      default: null,
    },
    scanClasses: {
      type: Array,
      required: true,
    },
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
      min: 0,
      minRules: [(v) => !!v || 'min is required'],
      max: 100,
      maxRules: [(v) => !!v || 'max is required'],
      deadband: 0,
      deadbandRules: [(v) => !!v || 'deadband is required'],
      scanClass: null,
      scanClassRules: [(v) => !!v || 'Scan class is required'],
      valid: false,
    }
  },
  computed: {
    scanClassItems() {
      return this.scanClasses.map((scanClass) => {
        return {
          value: scanClass.id,
          text: `${scanClass.name} (${scanClass.rate} ms)`,
        }
      })
    },
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
        return graphql.mutation.createTag
      } else if (this.operation === `update`) {
        return graphql.mutation.updateTag
      } else {
        return graphql.mutation.deleteTag
      }
    },
    mutationVariables() {
      if (this.operation === `create`) {
        return {
          name: this.name,
          description: this.description,
          datatype: this.datatype,
          scanClassId: this.scanClass,
          max: parseFloat(this.max),
          min: parseFloat(this.min),
          deadband: parseFloat(this.deadband),
          value: this.value.toString(),
        }
      } else if (this.operation === `update`) {
        return {
          id: this.initialData.id,
          name: this.name,
          description: this.description,
          datatype: this.datatype,
          scanClassId: this.scanClass,
          max: parseFloat(this.max),
          min: parseFloat(this.min),
          deadband: parseFloat(this.deadband),
          value: this.value.toString(),
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
    initializeData() {
      if (this.operation !== `create`) {
        this.name = this.initialData.name
        this.description = this.initialData.description
        this.datatype = this.initialData.datatype
        this.scanClass = this.initialData.scanClass.id
        this.max = `${this.initialData.max}`
        this.min = `${this.initialData.min}`
        this.deadband = `${this.initialData.deadband}`
        this.value = this.initialData.value
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
