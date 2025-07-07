<template>
  <div class="q-mb-sm">
    <q-card
      flat
      class="q-pa-none q-ma-none"
      style="background-color: transparent;"
    >
      <div class="row items-center justify-between">
        <div class="row nowrap">
          <strong class="q-mr-sm">{{ $t(entry.label) }}</strong>
          <span class="text-grey-7">({{ entry.key }})</span>
          <span class="row no-wrap q-ml-sm text-caption text-grey">
            <span
              class="flex flex-center"
              style="height: 25px; padding: 0px 10px; margin: 0px 5px;  border-radius: 12.5px; color: white"
              :style="{
                backgroundColor: [entry.type == 'page' ? 'green' : 'orange']
              }"
            >
              <span>
                {{ entry.type }}
              </span>
            </span>
            <span>
              {{ entry.type === "page" && entry.to ? `→ ${entry.to}` : "" }}
            </span>
          </span>
        </div>
        <div>
          <q-btn
            class="q-ma-sm"
            round
            icon="edit"
            color="positive"
            @click="$emit('edit', entry)"
          />
          <q-btn
            class="q-ma-sm"
            round
            icon="delete"
            color="negative"
            @click="$emit('delete', entry.id)"
          />
        </div>
      </div>

      <!-- Child Nodes -->
      <div
        class="q-ml-md q-pl-md q-mt-sm"
        style="border-radius: 8px"
        :style="{
          backgroundColor: [
            childEntries.length == 0 ? 'transparent' : '#0000000c'
          ]
        }"
      >
        <tree-node
          style="border-bottom: 1px solid #e1e1e1;"
          v-for="child in childEntries"
          :key="child.id"
          :entry="child"
          :all-entries="allEntries"
          @edit="$emit('edit', $event)"
          @delete="$emit('delete', $event)"
        />
      </div>
    </q-card>
  </div>
</template>

<script>
export default {
  name: "TreeNode",
  props: {
    entry: { type: Object, required: true },
    allEntries: { type: Array, required: true }
  },
  computed: {
    childEntries() {
      return this.allEntries.filter(e => e.parentId === this.entry.id);
    }
  }
};
</script>
