<template>
  <div class="home-container">
    <div class="home-container-left">
      <CGoogleMap></CGoogleMap>
    </div>
    <div class="home-container-right">
      <div class="home-container-right-top">
        <div class="container-logo"></div>
        <CFilter></CFilter>
      </div>
      <CRestaurantForm v-show="restaurantFormVisible"></CRestaurantForm>
      <CRestaurantsList></CRestaurantsList>
    </div>
    
  </div>
</template>

<script>
import CGoogleMap from '../components/CGoogleMap';
import CFilter from '../components/CFilter';
import CRestaurantsList from '../components/CRestaurantsList';
import CRestaurantForm from '../components/CRestaurantForm';
import EventBus from '../main';

export default {
  data(){
    return {
      restaurantFormVisible: false
    }
  },
  created() {
    this.$store.dispatch('getRestaurants');
  },
  mounted() {
    EventBus.$on('add-new-restaurant', () => this.restaurantFormVisible = true);
    EventBus.$on('close-restaurant-form', () => this.restaurantFormVisible = false);
  },
  components: {
    CGoogleMap,
    CFilter,
    CRestaurantsList,
    CRestaurantForm
  }
}
</script>

<style>
</style>