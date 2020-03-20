<template>
  <v-container>
    <v-tabs
      v-model="tab"
      background-color="transparent"
      color="primary"
      slider-color="primary"
    >
      <v-tab id="tabTag">
        Tags
      </v-tab>
      <v-tab id="tabScanClass">
        Scan Classes
      </v-tab>
      <v-tabs-items v-model="tab" class="transparent">
        <v-tab-item>
          <v-row>
            <v-col v-for="tag in tagsWithCalcs" :key="tag.id">
              <v-card class="d-flex flex-column" height="100%">
                <v-card-title headline>
                  {{ tag.name }}
                </v-card-title>
                <v-card-subtitle>{{ tag.description }}</v-card-subtitle>
                <v-card-text class="text-center">
                  <v-row justify-center no-gutters>
                    <v-col>
                      <v-progress-circular
                        v-if="tag.datatype !== 'BOOLEAN'"
                        color="orange darken-2"
                        :rotate="90"
                        :size="100"
                        :width="15"
                        :value="tag.value"
                        >{{
                          parseFloat(tag.percentage).toFixed(2)
                        }}</v-progress-circular
                      >
                      <v-row v-else justify-center>
                        <v-col width="48px">
                          <v-switch
                            v-model="tag.value"
                            class="switch--center"
                            color="orange darken-2"
                            readonly
                            width="48px"
                          ></v-switch>
                        </v-col>
                      </v-row>
                    </v-col>
                  </v-row>
                  <v-row justify-center dense>
                    <v-col>
                      <v-tooltip right transition="slide-x-transition">
                        <template v-slot:activator="{ on }">
                          <span v-on="on">
                            Scan Rate: {{ tag.scanClass.rate }} ms
                          </span>
                        </template>
                        <span>{{ tag.scanClass.name }}</span>
                      </v-tooltip>
                    </v-col>
                  </v-row>
                </v-card-text>
                <v-spacer></v-spacer>
                <v-card-actions>
                  <v-col>
                    <v-btn
                      :id="`editTag${tag.id}Button`"
                      color="primary"
                      block
                      @click.stop="openTagUpdateDialog(tag)"
                      ><v-icon left>mdi-pencil</v-icon>edit</v-btn
                    >
                  </v-col>
                  <v-col>
                    <v-btn
                      :id="`deleteTag${tag.id}Button`"
                      color="primary"
                      block
                      @click.stop="openTagDeleteDialog(tag)"
                      ><v-icon left>mdi-delete</v-icon>delete</v-btn
                    >
                  </v-col>
                </v-card-actions>
              </v-card>
            </v-col>
          </v-row>
          <v-dialog v-model="tagCreateDialog" max-width="500px">
            <template v-slot:activator="{ on }">
              <v-btn block outlined color="secondary" v-on="on"
                ><v-icon left>mdi-plus</v-icon>create tag</v-btn
              >
            </template>
            <jar-tag-form
              operation="create"
              :scan-classes="scanClasses"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="tagEditDialog" max-width="500px">
            <jar-tag-form
              operation="update"
              :scan-classes="scanClasses"
              :initial-data="tagSelected"
              @refetch="refetch"
            />
          </v-dialog>
          <v-dialog v-model="tagDeleteDialog" max-width="500px">
            <jar-tag-form
              operation="delete"
              :scan-classes="scanClasses"
              :initial-data="tagSelected"
              @refetch="refetch"
            />
          </v-dialog>
        </v-tab-item>
        <v-tab-item>
          <v-row dense>
            <v-col>
              <v-row>
                <v-col
                  v-for="scanClass in scanClasses"
                  :key="scanClass.id"
                  cols="12"
                >
                  <v-card>
                    <v-card-title headline>
                      {{ scanClass.name }}
                    </v-card-title>
                    <v-card-subtitle>{{
                      scanClass.description
                    }}</v-card-subtitle>
                    <v-card-text class="text-center">
                      <v-row justify-center no-gutters>
                        <v-col>
                          {{ scanClass.rate }} ms
                          <v-progress-linear
                            color="orange"
                            :value="(100 * scanClass.rate) / scanClassMaxRate"
                          ></v-progress-linear>
                        </v-col>
                      </v-row>
                    </v-card-text>
                    <v-card-actions>
                      <v-col>
                        <v-btn
                          :id="`editScanClass${scanClass.id}Button`"
                          color="primary"
                          block
                          @click.stop="openScanClassUpdateDialog(scanClass)"
                          ><v-icon left>mdi-pencil</v-icon>edit</v-btn
                        >
                      </v-col>
                      <v-col>
                        <v-btn
                          :id="`deleteScanClass${scanClass.id}Button`"
                          color="primary"
                          block
                          @click.stop="openScanClassDeleteDialog(scanClass)"
                          ><v-icon left>mdi-delete</v-icon>delete</v-btn
                        >
                      </v-col>
                    </v-card-actions>
                  </v-card>
                </v-col>
              </v-row>
              <v-dialog v-model="scanClassCreateDialog" max-width="500px">
                <template v-slot:activator="{ on }">
                  <v-btn block outlined color="secondary" v-on="on"
                    ><v-icon left>mdi-plus</v-icon>create scan class</v-btn
                  >
                </template>
                <jar-scan-class-form operation="create" @refetch="refetch" />
              </v-dialog>
              <v-dialog v-model="scanClassEditDialog" max-width="500px">
                <jar-scan-class-form
                  operation="update"
                  :initial-data="scanClassSelected"
                  @refetch="refetch"
                />
              </v-dialog>
              <v-dialog v-model="scanClassDeleteDialog" max-width="500px">
                <jar-scan-class-form
                  operation="delete"
                  :initial-data="scanClassSelected"
                  @refetch="refetch"
                />
              </v-dialog>
            </v-col>
          </v-row>
        </v-tab-item>
      </v-tabs-items>
    </v-tabs>
  </v-container>
</template>

<script>
import graphql from '~/graphql'
import ScanClassForm from '~/components/scanclass/Form.vue'
import TagForm from '~/components/tag/Form.vue'

export default {
  transition: 'slide-y-transition',
  middleware: 'auth',
  components: {
    jarScanClassForm: ScanClassForm,
    jarTagForm: TagForm
  },
  async asyncData({ app, params }) {
    const provider = app.apolloProvider
    const client = provider.defaultClient
    let error = null
    const tags = await client
      .query({
        query: graphql.query.tags
      })
      .then(({ data: { tags } }) => {
        return tags
      })
      .catch((e) => {
        error = e
      })
    const scanClasses = await client
      .query({
        query: graphql.query.scanClasses
      })
      .then(({ data: { scanClasses } }) => {
        return scanClasses
      })
      .catch((e) => {
        error = e
      })
    return {
      tags,
      scanClasses,
      error
    }
  },
  data() {
    return {
      error: null,
      tags: [],
      scanClasses: [],
      scanClassSelected: null,
      scanClassCreateDialog: false,
      scanClassEditDialog: false,
      scanClassDeleteDialog: false,
      tagSelected: null,
      tagCreateDialog: false,
      tagEditDialog: false,
      tagDeleteDialog: false,
      tab: 0
    }
  },
  computed: {
    scanClassMaxRate() {
      return this.scanClasses.reduce((a, scanClass) => {
        return scanClass.rate > a ? scanClass.rate : a
      }, 0)
    },
    tagsWithCalcs() {
      return this.tags.map((tag) => {
        const min = tag.min ? tag.min : 0
        const max = tag.max ? tag.max : 100
        const percentage = ((tag.value - min) / (max - min)) * 100
        return {
          ...tag,
          percentage,
          value:
            tag.datatype === `BOOLEAN` ? tag.value + '' === 'true' : tag.value
        }
      })
    }
  },
  methods: {
    openScanClassUpdateDialog(scanClass) {
      this.scanClassSelected = scanClass
      this.scanClassEditDialog = true
    },
    openScanClassDeleteDialog(scanClass) {
      this.scanClassSelected = scanClass
      this.scanClassDeleteDialog = true
    },
    openTagUpdateDialog(tag) {
      this.tagSelected = tag
      this.tagEditDialog = true
    },
    openTagDeleteDialog(tag) {
      this.tagSelected = tag
      this.tagDeleteDialog = true
    },
    refetch() {
      this.scanClassCreateDialog = false
      this.scanClassEditDialog = false
      this.scanClassDeleteDialog = false
      this.tagCreateDialog = false
      this.tagEditDialog = false
      this.tagDeleteDialog = false
      this.$apollo.queries.scanClasses.refetch()
      this.$apollo.queries.tags.refetch()
    }
  },
  apollo: {
    scanClasses: {
      query: graphql.query.scanClasses
    },
    tags: {
      query: graphql.query.tags,
      subscribeToMore: {
        document: graphql.subscription.tagUpdate
      }
    }
  }
}
</script>

<style>
.switch--center > div > div {
  justify-content: center;
}
</style>
