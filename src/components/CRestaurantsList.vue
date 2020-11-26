<template>
  <div>
    <div class="restaurants-counter">
      <h4>{{ restaurantsToDisplay.length }} restaurants</h4>
    </div>
    <div class="container-list">
      <div class="container-list-card" v-for="(restaurant, i) in restaurantsToDisplay" :key="i">
        <div class="container-list-card-image">
          <img :src="'https://maps.googleapis.com/maps/api/streetview?size=130x120&location=' 
          + restaurant.position.lat + ',' 
          + restaurant.position.lng + 
          '&heading=151.78&pitch=-0.76&key=' + key" alt="">
        </div>
        <div class="container-list-card-content">
          <div class="container-list-card-content-header">{{ restaurant.restaurantName }}</div>
          <div class="container-list-card-content-meta">{{ restaurant.address }}</div>
          <div class="container-list-card-content-extra">
            <div class="container-list-card-content-extra-rating">
              <p>NOTE</p> 
              <p>{{ restaurant.averageRating }}/5</p>
            </div>
            <button class="container-list-card-content-extra-button ui button" 
              @click="openRatingModal(restaurant.id, restaurant.restaurantName, restaurant.ratings)"
            >
              Voir les avis
            </button>
          </div>
        </div>
      </div>
    </div>
    <div v-show="ratingModalVisible">
      <CRatingForm :restaurantId="restaurantToRate" :restaurantName="restaurantToRateName" :restaurantRatings="restaurantToRateRatings"></CRatingForm>
    </div>
  </div>
</template>

<script>
import CRatingForm from './CRatingForm';
import EventBus from '../main';

export default {
  data() {
    return {
      restaurantToRate: null,
      restaurantToRateName: null,
      restaurantToRateRatings: null,
      ratingModalVisible: false,
      key: process.env.VUE_APP_API_KEY
    }
  },
  methods: {
    openRatingModal(restaurantId, restaurantName, restaurantReviews) {
      this.restaurantToRate = restaurantId;
      this.restaurantToRateName = restaurantName;
      this.restaurantToRateRatings = restaurantReviews;
      this.ratingModalVisible = true;
      EventBus.$emit('open-rating-modal');
    },
    closeRatingModal() {
      this.restaurantToRate = null;
      this.ratingModalVisible = false;
    }
  },
  computed: {
    restaurantsToDisplay() {
      return this.$store.getters.restaurantsToDisplay;
    }
  },
  mounted() {
    EventBus.$on('show-restaurant-ratings', (restaurantId, restaurantName, restaurantReviews) => {
      this.openRatingModal(restaurantId, restaurantName, restaurantReviews)
    });
  },
  components: {
    CRatingForm
  }
}
</script>

<style>
</style>