<template>
  <v-container grid-list-xs>
    <v-layout column justify-center align-center>
      <jar-login />
    </v-layout>
  </v-container>
</template>

<script>
import Login from '~/components/Login'
export default {
  components: {
    jarLogin: Login,
  },
  transition: 'slide-y-transition',
}
</script>
