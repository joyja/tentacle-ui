<template>
  <v-app>
    <v-navigation-drawer
      v-model="drawer"
      fixed
      dark
      color="blue-grey darken-2"
      app
    >
      <v-list>
        <v-list-item
          v-for="(item, i) in items"
          :key="i"
          :to="item.to"
          router
          exact
        >
          <v-list-item-action>
            <v-icon>{{ item.icon }}</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="item.title" />
          </v-list-item-content>
        </v-list-item>
        <v-list-item>
          <v-list-item-action>
            <v-icon>mdi-account</v-icon>
          </v-list-item-action>
          <v-list-item-content>
            <v-list-item-title v-text="user && user.username" />
          </v-list-item-content>
        </v-list-item>
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="blue-grey darken-4" dark fixed app>
      <v-app-bar-nav-icon @click.stop="drawer = !drawer"></v-app-bar-nav-icon>
      <img src="~/assets/tentacle.png" />
      <v-spacer></v-spacer>
      <v-menu v-if="user" offset-y>
        <template v-slot:activator="{ on }">
          <v-btn slot="activator" text v-on="on">
            <v-icon left>mdi-account</v-icon>
            {{ user.username }}
          </v-btn>
        </template>
        <v-list>
          <v-list-item @click="logout">
            <v-list-item-title>Logout</v-list-item-title>
          </v-list-item>
        </v-list>
      </v-menu>
    </v-app-bar>
    <v-content>
      <nuxt />
    </v-content>
    <v-footer color="blue-grey darken-4" dark fixed app>
      <span>&copy; JAR Automation {{ new Date().getFullYear() }}</span>
    </v-footer>
  </v-app>
</template>

<script>
import { mapState, mapMutations } from 'vuex'
export default {
  data() {
    return {
      drawer: false,
      items: [],
      right: true,
      title: 'Tentacle'
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    logout() {
      this.$apolloHelpers.onLogout()
      this.setState({ key: 'user', value: null })
      this.$router.push({ name: 'login' })
    },
    ...mapMutations(['setState'])
  }
}
</script>
