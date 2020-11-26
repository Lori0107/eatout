<template>
  <gmap-map
    v-if="userLocation != null"
    ref="gmap"
    id="#map"
    map-type-id="terrain"
    :center="userLocation"
    :zoom="10"
    :options="{
      mapTypeControl: false,
      streetViewControl: false,
      fullscreenControl: false,
    }"
    @click="addRestaurant($event)"
    @bounds_changed="boundsChanged($event)"
  >
    <div v-show="positionLoading">LOCALISATION EN COURS</div>
    <gmap-info-window
      :options="infoWindowOptions" 
      :position="infoWindowPosition" 
      :opened="infoWindowOpen"
      v-model="restaurantInfo"
      @closeclick="infoWindowOpen = false">
      <div id="infoWindow">
        <div class="header-img">
          <img :src="'https://maps.googleapis.com/maps/api/streetview?size=130x120&location=' 
          + restaurantInfo.position.lat + ',' 
          + restaurantInfo.position.lng + 
          '&heading=151.78&pitch=-0.76&key=' + key" alt="">
        </div>
        <div class="content">
          <h4>{{ restaurantInfo.restaurantName }}</h4>
          <p>{{ restaurantInfo.address }}</p>
          <a 
            class="orange text" 
            @click="showRestaurantRatings(restaurantInfo.id, restaurantInfo.restaurantName, restaurantInfo.ratings)"
          >
            Voir les avis
          </a>
        </div>
      </div>
    </gmap-info-window>

    <gmap-marker 
      ref="markers"
      v-for="(user, i) in userMarker"
      :key="'user' +  i"
      :position="user.position" 
      :clickable="true" 
      :draggable="true" 
      icon="http://maps.google.com/mapfiles/ms/icons/blue-dot.png"
    >
    </gmap-marker>
    
    <gmap-marker 
      v-for="(restaurant, i) in restaurants"
      :key="i"
      :position="restaurant.position"
      :clickable="true" 
      :draggable="false"
      @click="toggleInfoWindow(restaurant, i)">
    </gmap-marker>
  </gmap-map>
</template>

<script>
import EventBus from '../main';

export default {
  data() {
    return {
      key: process.env.VUE_APP_API_KEY,
      positionLoading: false,
      userLocation: { lat: 45.508, lng: -73.587 },
      userMarker: [],
      restaurantsVisibles: [],
      infoWindowOptions: {
        pixelOffset: {
          width: 0,
          height: -35
        }
      },
      infoWindowPosition: null,
      infoWindowOpen: false,
      restaurantInfo: {
        position: {
          lat: null, 
          long: null}
      }
    }
  },
  methods: {
    getUserLocation() {
      if(navigator.geolocation) {
        this.positionLoading = true;
        navigator.geolocation.getCurrentPosition(this.saveUserLocation, this.handleErrorPosition)
      } else {
        alert('La géolocalisation n\'est pas supportée par votre navigateur.');
      }
    },
    saveUserLocation(position) {
      this.positionLoading = false;
      console.log("Position récupérée");
      this.userLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
      this.userMarker = [{ position: { lat: position.coords.latitude, lng: position.coords.longitude }}];
      this.$store.dispatch(
        'getGplaceRestaurants', 
        {
          lat: position.coords.latitude, 
          long: position.coords.longitude
        }
      );
    },
    handleErrorPosition(error) {
      console.log(error);
      switch(error.code) {
        case error.PERMISSION_DENIED:
          alert("Vous avez refusé la géolocalisation.");
          break;
        case error.POSITION_UNAVAILABLE:
          alert("Vos informations de localisation sont indisponibles.");
          break;
        case error.TIMEOUT:
          alert("La requête de géolocalisation a expiré.");
          break;
        case error.UNKNOWN_ERROR:
          alert("Une erreur est survenue.");
          break;
      }
    },
    getRestaurantsLocations() {
      return this.restaurants.map(restaurant => {
        return restaurant = { ...restaurant, position: { lat: restaurant.lat, lng: restaurant.long }};
      });
    },
    boundsChanged(bounds) {
      this.$store.dispatch('setBounds', bounds);
      this.$store.dispatch('getGplaceRestaurants', 
        {
          lat: this.$refs.gmap.$mapObject.getCenter().lat(), 
          long: this.$refs.gmap.$mapObject.getCenter().lng()
        }
      );
      this.getRestaurantsOnGmap(this.restaurants, this.bounds);
    },
    getRestaurantsOnGmap(restaurants, bounds) {
      const restaurantsOnGmap = restaurants.filter(restaurant => {
        const location = new google.maps.LatLng(restaurant.position.lat, restaurant.position.lng);
        return bounds && bounds.contains(location);
      });
      this.$store.commit('SET_RESTAURANTS_VISIBLES', restaurantsOnGmap);
    },
    toggleInfoWindow(restaurant, index) {
      this.infoWindowPosition = restaurant.position;
      this.restaurantInfo = restaurant;
      this.restaurantInfo.ratings = restaurant.ratings;
      this.infoWindowOpen = true;
    },
    addRestaurant(position) {
      EventBus.$emit('add-new-restaurant');
      this.$store.dispatch('setNewRestaurantPosition', {lat: position.latLng.lat(), long: position.latLng.lng()});
    },
    showRestaurantRatings(restaurantId, restaurantName, restaurantReviews) {
      EventBus.$emit('show-restaurant-ratings', restaurantId, restaurantName, restaurantReviews);
    }
  },
  computed: {
    restaurants() {
      return this.$store.getters.restaurantsFiltered;
    },
    bounds() {
      return this.$store.getters.lastBoundsCoordinates;
    }
  },
  watch: {
    restaurants() {
      this.getRestaurantsOnGmap(this.restaurants, this.bounds);
    }
  },
  mounted() {
    this.getUserLocation();
  }
}
</script>

<style>
</style>