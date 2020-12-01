<template>
  <div class="d-flex flex-column align-center" style="min-width: 400px">
    <v-card class="mb-3" width="100%">
      <v-form
        ref="loginForm"
        v-model="valid"
        class="m-3"
        @submit.prevent="login"
      >
        <v-card-text>
          <v-text-field
            id="username"
            v-model="username"
            name="username"
            label="Username"
            :rules="usernameRules"
          ></v-text-field>
          <v-text-field
            id="password"
            v-model="password"
            :type="passwordShow ? 'text' : 'password'"
            :append-icon="passwordShow ? 'mdi-eye' : 'mdi-eye-off'"
            name="password"
            label="Password"
            :rules="passwordRules"
            @click:append="passwordShow = !passwordShow"
          ></v-text-field>
        </v-card-text>
        <v-card-actions>
          <v-btn type="submit" block color="primary" :disabled="!valid"
            >Login</v-btn
          >
        </v-card-actions>
      </v-form>
    </v-card>
    <v-alert
      transition="scale-transition"
      type="error"
      :value="error !== null"
      width="100%"
      >{{
        error ? error.message.replace('GraphQL error: ', '') : null
      }}</v-alert
    >
  </div>
</template>

<script>
import { mapMutations } from 'vuex'
import graphql from '~/graphql'
export default {
  data() {
    return {
      valid: false,
      username: ``,
      usernameRules: [(v) => !!v || 'Username is required'],
      password: ``,
      passwordRules: [(v) => !!v || 'Password is required'],
      passwordShow: false,
      error: null,
    }
  },
  methods: {
    async login() {
      try {
        const {
          data: {
            login: { user, token },
          },
        } = await this.$apollo
          .mutate({
            mutation: graphql.mutation.login,
            variables: {
              username: this.username,
              password: this.password,
            },
          })
          .catch((error) => {
            this.$apolloHelpers.onLogout()
            throw error
          })
        this.error = null
        this.$apolloHelpers.onLogin(token)
        this.setState({ key: 'user', value: user })
        this.$router.push({ name: 'index' })
      } catch (error) {
        this.error = error
      }
    },
    ...mapMutations(['setState']),
  },
}
</script>
