<template>
  <div class="container-filter">
    <div class="container-filter-header">
      <p>Filtrer par note</p>
    </div>
    <div class="container-filter-inputs">
      <div class="ui mini labeled input rating min">
        <div class="ui label">
          Note minimale
        </div>
        <input 
          v-model="minStars" 
          @input="updateFilter(minStars, maxStars)" 
          type="number" 
          name="min-stars" 
          min="0" 
          max="5"
        >
      </div>
      <div class="ui mini labeled input rating max">
        <div class="ui label">
          Note maximale
        </div>
        <input 
          v-model="maxStars" 
          @input="updateFilter(minStars, maxStars)" 
          type="number" 
          name="max-stars" 
          min="0" 
          max="5"
        >
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      minStars: 0,
      maxStars: 5
    }
  },
  methods: {
    updateFilter(min, max) {
      this.$store.dispatch('setFilter', { min, max })
    }
  }
}
</script>

<style>
</style>