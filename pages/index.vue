<template>
  <v-container grid-list-xs>
    <v-layout column justify-center align-center>
      <v-card v-for="tag in tags" :key="tag.id">
        <v-card-title headline>
          {{ tag.name }}
        </v-card-title>
        <v-card-subtitle>{{ tag.description }}</v-card-subtitle>
        <v-card-text>
          <v-progress-circular :size="100" :width="15" :value="tag.value">{{
            tag.value
          }}</v-progress-circular>
        </v-card-text>
        <v-card-actions>
          <v-btn block color="primary" dark>edit</v-btn>
        </v-card-actions>
      </v-card>
    </v-layout>
  </v-container>
</template>

<script>
import graphql from '~/graphql'

export default {
  transition: 'slide-y-transition',
  middleware: 'auth',
  apollo: {
    tags: {
      query: graphql.query.tags
    }
  }
}
</script>
