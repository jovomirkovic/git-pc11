<template>
  <span>
    <q-item
      :to="item.to"
      active-class="tab-active"
      class="q-ma-sm navigation-item"
      clickable
      v-ripple
      @click="$emit('update-putanja', item.to)"
    >
      <q-item-section avatar>
        <img
          v-if="item.icon != undefined"
          :src="
            require(`src/assets/pro-coach11 assets/ikonice/web/Sidebar/${item.icon}`)
          "
        />
        <img
          v-else
          :src="
            require(`src/assets/pro-coach11 assets/ikonice/web/Sidebar/Administration.svg`)
          "
        />
      </q-item-section>

      <q-item-section>
        {{ $t(item.label) }}
      </q-item-section>
    </q-item>
    <q-item-section v-if="item.children.length > 0" class="q-ma-none q-ml-xl">
      <menuItemComponent
        v-for="item1 in item.children.filter(e => e.type != 'component')"
        :key="item1.to + 'children'"
        :item="item1"
        @update-putanja="$emit('update-putanja', $event)"
      ></menuItemComponent>
    </q-item-section>
  </span>
</template>
<script>
export default {
  name: "menuItemComponent",
  components: {},
  props: ["item"],
  data() {
    return {};
  },
  created() {},
  methods: {}
};
</script>
