<template>
  <v-card class="mt-5" width="100%" max-width="500px">
    <v-card-text>
      <v-treeview dense :items="items"></v-treeview>
    </v-card-text>
  </v-card>
</template>

<script>
import graphql from '~/graphql'

export default {
  props: {
    deviceId: {
      type: String,
      required: true,
    },
  },
  data() {
    return {
      device: null,
    }
  },
  computed: {
    items() {
      if (this.device) {
        return this.device.config.tags
          .map((tag, i) => {
            return {
              id: i,
              name: tag.name,
              children: tag.template ? tag.template.members : [],
            }
          })
          .sort((a, b) => {
            if (a.name > b.name) {
              return 1
            }
            if (a.name < b.name) {
              return -1
            }
            return 0
          })
      } else {
        return []
      }
    },
  },
  apollo: {
    device: {
      variables() {
        return {
          id: this.deviceId,
        }
      },
      query: graphql.query.tagBrowse,
    },
  },
}
</script>
