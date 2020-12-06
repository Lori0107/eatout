import { Module } from 'vuex';
import axios from 'axios';
import Restaurant from '../../interfaces/restaurantInterface'
import {
  getAverageRating, 
  getFilteredRestaurants,
  setIdToNewRestaurant, 
  setPositionToNewRestaurant,
  formatGplaceRestaurant,
  checkIfIdExist,
} from '../../services/restaurants'

export const restaurants: Module<any, any> = {
  state: () => ({
    restaurants: Array<Restaurant>(),
    restaurantsVisibles: Array<Restaurant>(),
    minStars: 0,
    maxStars: 5,
    bounds: Object,
    newRestaurantPosition: Object
  }),
  getters: {
    allRestaurants: state => {
      return state.restaurants;
    },
    lastBoundsCoordinates: state => {
      return state.bounds;
    },
    restaurantsFiltered: state => {
      return getFilteredRestaurants(state.restaurants, state.minStars, state.maxStars);
    },
    restaurantsToDisplay: state => {
      return state.restaurantsVisibles;
    },
    restaurantFormVisible: state => {
      return state.restaurantFormVisible;
    }
  },
  mutations: {
    SET_RESTAURANTS: (state, jsonRestaurants: Restaurant[]) => {
      state.restaurants = jsonRestaurants;
    },
    SET_RESTAURANTS_GMAP_POSITIONS: (state) => {
      state.restaurants.map((restaurant: Restaurant) => restaurant.position = { lat: restaurant.lat, lng: restaurant.long });
    },
    SET_RESTAURANTS_AVERAGE_RATING: (state) => {
      state.restaurants.map((restaurant: Restaurant) => {
        restaurant.averageRating = getAverageRating(restaurant.ratings);
      });
    },
    SET_RESTAURANT_AVERAGE_RATING: (state, restaurantId) => {
      const restaurant = state.restaurants.find((restaurant: Restaurant) => restaurant.id === restaurantId)
      restaurant.averageRating = getAverageRating(restaurant.ratings);
    },
    SET_FILTER_MIN_MAX: (state, payload) => {
      state.minStars = payload.min;
      state.maxStars = payload.max;
    },
    SET_RATING_TO_RESTAURANT: (state, payload) => {
      const restaurantToRate = state.restaurants.find((restaurant: Restaurant) => restaurant.id === payload.restaurantId);
      restaurantToRate.ratings.push({stars: payload.rating.stars, comment: payload.rating.comment});
    },
    SET_NEW_RESTAURANT_POSITION: (state, payload) => {
      state.newRestaurantPosition = payload;
    },
    POST_RESTAURANT: (state, payload: Restaurant) => {
      setIdToNewRestaurant(state.restaurants, payload);
      setPositionToNewRestaurant(state.newRestaurantPosition, payload);
      payload.averageRating = 0;
      state.restaurants.push(payload)
    },
    POST_GPLACE_RESTAURANT: (state, payload) => {
      if(!checkIfIdExist(state.restaurants, payload.place_id)) {
        state.restaurants.push(formatGplaceRestaurant(payload));
      };
    },
    SET_RESTAURANTS_VISIBLES: (state, payload) => {
      state.restaurantsVisibles = payload;
    },
    SET_BOUNDS: (state, bounds) => {
      state.bounds = bounds;
    }
  },
  actions: {
    getRestaurants: ({commit}) => {
      fetch('http://localhost:8080/static/restaurants.json')
      .then(response => {
        return response.json();
      })
      .then(data => {
        commit('SET_RESTAURANTS', data);
        commit('SET_RESTAURANTS_GMAP_POSITIONS');
        commit('SET_RESTAURANTS_AVERAGE_RATING');
      })
    },
    getGplaceRestaurants: ({dispatch}, mapPosition) => {
      axios.get(
        'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=' 
        + mapPosition.lat + ',' 
        + mapPosition.long +
        '&radius=200&type=restaurant&key=' + process.env.VUE_APP_API_KEY)
      .then(response => {
        dispatch('getGplaceRatings', response.data.results);
      }).catch(error => {
        console.log("Google places error: ", error);
      })
    },
    getGplaceRatings: ({commit}, gmapRestaurants) => {
      gmapRestaurants.map((restaurant: any) => {
        axios.get(
          'https://cors-anywhere.herokuapp.com/https://maps.googleapis.com/maps/api/place/details/json?place_id='
          + restaurant.place_id +
          '&fields=reviews&key=' + process.env.VUE_APP_API_KEY)
        .then(response => {
          restaurant.ratings = [];
          const reviews = response.data.result.reviews;
          if(reviews) {
            reviews.forEach((review: any) => {
              restaurant.ratings.push({stars: review.rating, comment: review.text});
            });
            commit('POST_GPLACE_RESTAURANT', restaurant);
          }
        }).catch(error => {
          console.log(error);
        })
      })
    },
    setFilter: ({commit}, filterData) => {
      commit('SET_FILTER_MIN_MAX', filterData);
    },
    setRating: ({commit}, newRating) => {
      commit('SET_RATING_TO_RESTAURANT', newRating);
      commit('SET_RESTAURANT_AVERAGE_RATING', newRating.restaurantId);
    },
    setNewRestaurantPosition: ({commit}, position) => {
      commit('SET_NEW_RESTAURANT_POSITION', position);
    },
    postRestaurant: ({commit}, newRestaurant) => {
      commit('POST_RESTAURANT', newRestaurant);
      commit('SET_RESTAURANTS_GMAP_POSITIONS');
    },
    setBounds: ({commit}, bounds) => {
      commit('SET_BOUNDS', bounds);
    }
  }
};