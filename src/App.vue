<template>
  <div id="app">
    <GmapMap
      id="#map"
      :center="center"
      :zoom="7"
      map-type-id="terrain"
      style="width: 500px; height: 300px"
    ></GmapMap>
  </div>
</template>

<script>
export default {
  data() {
    return {
      center: { lat: 45.508, lng: -73.587 }
    }
  },
  mounted() {
    navigator.geolocation.getCurrentPosition((position) => {
      console.log(position.coords.latitude, position.coords.longitude);
    });
  }
}
</script>

<style>
#map {
  height: 500px;
  width: 500px;
  border: 2px solid lightgrey;
  border-radius: 5px
}
</style>
