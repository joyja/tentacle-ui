<template>
  <v-app>
    <v-navigation-drawer v-model="drawer" fixed app>
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
      </v-list>
    </v-navigation-drawer>
    <v-app-bar color="blue-grey darken-4" dark fixed app>
      <img src="~/assets/tentacle.png" />
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
export default {
  data() {
    return {
      drawer: false,
      items: [],
      right: true,
      title: 'Tentacle'
    }
  }
}
</script>
