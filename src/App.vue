<template>
<div id="app">
    <nav>
        <transition name="fade">
            <template v-if="$favorites.opened">
                <Favorites :favoritesList="favorites" /></template>
        </transition>
    </nav>
    <div class="holder">
        <div class="holder__nav-title">
            <router-link to="/">
                <home-icon class="holder__nav-title--home" @click="isFavoritesOpened" />
            </router-link>
            <h3>{{this.routeActiveTitle ? routeActiveTitle : searchTitle }}</h3>
            <div>
                <bookmark-icon @click="$favorites.open" />
            </div>
        </div>
        <div v-if="visibleSearch && this.$route.name!=='LineStop'" class="holder__search">
            <input type="text" v-model="searchLocation" v-on:keyup.enter="searchValue()" :placeholder="searchPlaceholder" autofocus />
            <button type="button" class="holder__search--button" :disabled="this.loading || !this.searchLocation.length>0" @click="searchValue()">
                <search-icon /> show results</button>
        </div>
        <div v-if="this.$route.name!=='LineStop'" class="holder__searched-results" :style="[this.loading? {'justify-content' : 'center' } : {'justify-content' : 'flex-start' }]">
            <div v-if="this.loading">
                <div class="holder__searched-results--loader"></div>
            </div>
            <template v-else>
                <template v-if="this.dataObject.length>1">
                    <div id="results-header"><span>
                            <map-pin-icon />{{listTitle}} </span><span>
                            {{showTransportTitle}}
                            <toggle-button id="toggle-button" :value="this.showTransport" @change="toggleTransportOption" :labels="true" :color="{ checked: '#5BC88D', unchecked: '#BBB'}" /></span></div>
                    <ul>
                        <li v-for="(item, index) in this.dataObject" :key="index"><span>
                                <bookmark-icon class="holder__searched-results--favorite" @click="addFavorite(item.name, item.id, index)" />
                                <router-link :to="{ name: 'LineStop', params: {id: item.id} }">{{item.name}}</router-link>

                            </span>
                            <span v-if="showTransport">
                                <car-icon v-if="item.products['suburban']" />
                                <train-icon v-if="item.products['subway']" />
                                <train-icon v-if="item.products['tram']" />
                                <bus-icon v-if="item.products['bus']" />
                                <ship-icon v-if="item.products['ferry']" />
                                <train-icon v-if="item.products['express']" />
                                <train-icon v-if="item.products['regional']" />
                            </span>
                            <span>
                                <line-icon />{{item.lines.length}}<a rel="external" :href="'https://www.google.com/maps?q='+ item.location.latitude + ',' + item.location.longitude" target="_blank">
                                    <map-2-icon /></a></span></li>
                    </ul>
                </template>
                <template v-else>
                    <div v-if="this.offlineMode" class="holder__searched-results--offline">
                        <div>
                            <wifi-off-icon />
                        </div>
                        <div>{{offlineTitle}}</div>
                    </div>
                </template>
            </template>
        </div>
        <div class="holder__router-holder">
            <router-view :stationData="$route.params.id" :favoritesData="favorites" :key="$route.path"/>
        </div>
    </div>

</div>
</template>

<script>
import Favorites from '@/components/Favorites.vue'
export default {

    name: 'App',
    data() {
        return {
            searchTitle: 'Find a stop to get details for the transport',
            routeActiveTitle: '',
            searchPlaceholder: 'enter stop name',
            dataObject: [],
            loading: false,
            favRoute: 'Favorite',
            lineStopRoute: 'Station',
            visibleSearch: true,
            searchLocation: '',
            listTitle: 'Stations/(stops)',
            showTransport: false,
            showTransportTitle: 'transport types',
            favorites: [],
            offlineMode: false,
            offlineTitle: 'You are not connected to internet!',
            bookmarked: []
        }
    },
    components: {
        Favorites
    },

    mounted() {
        if (window.location.pathname !== '/') {
            this.$router.push('/');
        }
    },
    methods: {

        getLocations: function () {
            this.loading = true
            this.axios.get('https://v5.vbb.transport.rest/locations', {
                    params: {
                        'query': this.searchLocation,
                        'stops': true,
                        'linesOfStops': true,
                        'results': 8
                    }
                })
                .then(response => this.dataObject = response.data)
                .catch(function (error) {
                    console.log(error);
                }).finally(() => this.loading = false);
        },

        isFavoritesOpened() {
            if (this.$favorites.opened) {
                return this.$favorites.open()
            }
        },

        searchValue() {
            if (navigator.onLine) {
                this.offlineMode = false
                if (this.searchLocation.length > 0) {
                    localStorage.setItem('searchedValue', this.searchLocation)
                    return this.getLocations()
                }
            } else {
                this.offlineMode = true
            }

        },

        toggleTransportOption() {
            this.showTransport = !this.showTransport
        },

        addFavorite(name, id, index) {
            if (!this.bookmarked[index]) {
                this.favorites.push(name + '/' + id)
                this.bookmarked[index] = true
            }

            if (!this.$favorites.opened) {
                this.$favorites.open()
            }

        },

        removeFavorite(index) {
            this.favorites.splice(index, 1);
            this.bookmarked[index] = false
        },

        getTransportOptions: function (value) {
            Object.keys(value).forEach(function (item) {
                if (value[item] === true) {
                    return item
                }
            });
        }
    },

    watch: {
        '$route'(to, from) {
            if (to !== from) {
                if (to.name === 'favoritesRoute') {
                    this.visibleSearch = false
                    this.routeActiveTitle = this.favRoute + ' Station'
                } else if (to.name === 'LineStop') {
                    this.visibleSearch = true
                    this.routeActiveTitle = this.lineStopRoute + ' Information'
                } else {
                    this.visibleSearch = true
                    this.searchLocation = ''
                    this.dataObject = {}
                }
                return to.name === null ? this.routeActiveTitle = '' : ''
            }
        }
    }
}
</script>

<style lang="scss">
@import "@/assets/styles/color.scss";

body {
    margin: 0;
    height: 100%;
    width: 100%;
    background: $yellow;
}

#app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    display: flex;
    flex-direction: row;

    .fade-enter-active,
    .fade-leave-active {
        transition: width .5s, opacity 1s 0.4s;
        opacity: 1;
    }

    .fade-enter,
    .fade-leave-to {
        opacity: 0;
        width: 0;
    }
}

.holder {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    &::after {
        content: "";
        background-image: url('https://images.unsplash.com/photo-1520594923568-1b5d82587f86?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1950&q=80');
        background-size: cover;
        background-repeat: repeat-y;
        position: absolute;
        top: 0px;
        right: 0px;
        bottom: 0px;
        left: 0px;
        opacity: 0.05;
        pointer-events: none;
    }

    &__searched-results {
        padding: 10px 0;
        display: flex;
        flex-direction: column;
        height: 100%;
        align-items: center;

        &--loader {
            border: 16px solid $lightBlue;
            border-top: 16px solid $white;
            border-radius: 50%;
            width: 60px;
            height: 60px;
            animation: spin 2s linear infinite;
            margin-top: -80px;

            @media (orientation: landscape) {
                margin-top: 0;
            }
        }

        &--favorite {
            cursor: pointer;

            &:hover {
                stroke: $lightBlue;
            }

            &.icon-off {
                stroke: $blue;

                &:hover {
                    stroke: $red;
                }
            }
        }

        &--offline {
            display: flex;
            justify-content: center;
            margin-top: 120px;
            flex-direction: column;
            font-size: 28px;

            >div {
                align-self: center;
                margin-bottom: 40px;

                svg {
                    height: 38px;
                    width: 38px;
                }
            }
        }

        #results-header {
            margin-top: 20px;
            padding-left: 20px;
            font-weight: bold;
            width: 80%;
            letter-spacing: 0.06em;
            display: flex;
            justify-content: space-between;

            span {
                display: flex;
                align-items: center;
                line-height: 1;

                svg {
                    margin-right: 19px;
                }

                #toggle-button {
                    margin-left: 10px;
                    margin-right: 10px;
                }
            }
        }

        ul {
            list-style-type: none;
            width: 80%;
            text-align: left;
            font-weight: bold;
            border: 2px solid $blue;
            border-radius: .25rem;
            margin-inline-start: 0;
            padding-inline-start: 0;

            li {
                padding: 10px 24px 10px 10px;
                transition: all 0.3s ease-out;
                display: flex;
                justify-content: space-between;
                align-items: center;

                a {
                    text-decoration: none;

                    &:link,
                    &:active {
                        color: $black;
                    }

                    &:hover {
                        color: $lightBlue;
                    }
                }

                span {
                    display: flex;
                    justify-content: space-between;

                    a {
                        margin-left: 20px;
                        flex: 1;
                        word-break: break-all;
                    }

                    &:last-of-type {
                        >svg {
                            padding-right: 4px;
                        }
                    }
                }

                &:nth-child(even) {
                    background: $white;
                }

                &:nth-child(odd) {
                    background: $borderGray;
                }

                &:hover {
                    box-shadow: 0 0 0 2pt $lightBlue;
                    background-color: rgba($white, 0.4);
                    color: $blue;
                }
            }

            &:hover {
                border-color: $lightBlue;
            }
        }
    }

    @keyframes spin {
        0% {
            transform: rotate(0deg);
        }

        100% {
            transform: rotate(360deg);
        }
    }

    &__nav-title {
        display: flex;
        align-items: center;
        height: 86px;
        color: $black;
        font-size: 16px;
        font-weight: bold;
        line-height: 20px;
        text-align: center;
        padding-left: 40px;
        justify-content: space-between;
        text-transform: uppercase;

        svg {
            height: 38px;
            width: 38px;
            stroke: $black;
        }

        &--home {
            padding-right: 16px;

            &:hover {
                stroke: $lightBlue;
            }
        }

        h3 {
            font-size: 1.2rem;
        }

        & div:last-child {
            display: flex;
            align-items: center;
            padding-right: 30px;
            font-weight: bold;
            cursor: pointer;

            @keyframes opacity {
                0% {
                    opacity: 0;
                }

                100% {
                    opacity: 1;
                }
            }

            &:hover::before {
                content: 'favorites';
                transform: rotate(90deg);
                position: absolute;
                right: 6px;
                top: 100px;
                font-weight: bold;
                -webkit-font-smoothing: antialiased;
                animation: opacity .5s ease-out 1;
            }

            svg {
                padding-left: 6px;

                &:hover {
                    stroke: $lightBlue;
                }
            }
        }
    }

    &__search {
        padding: 110px 40px 0 40px;
        display: flex;
        justify-content: space-around;
        align-items: center;
        flex-wrap: wrap;

        input {
            text-align: center;
            border: 2px solid $blue;
            border-radius: .25rem;
            height: 30px;
            font-size: 18px;
            padding: 0 10px;
            min-width: 200px;
            color: $blue;
            outline: none;
            margin-bottom: 20px;

            &:hover {
                cursor: help;
            }

            &:focus {
                border-color: $lightBlue;
            }
        }

        &--button {
            display: flex;
            align-items: center;
            height: 33px;
            padding: 0 16px 0 12px;
            cursor: pointer;
            font-weight: bold;
            color: $white;
            border: 2px solid $lightBlue;
            border-radius: .25rem;
            background-color: $lightBlue;
            transition: background-color 0.3 ease-out;
            text-transform: uppercase;
            letter-spacing: 0.02em;
            margin-bottom: 20px;

            &[disabled] {
                background-color: $black;
                border-color: $black;
                position: relative;

                &:hover {
                    text-decoration: none;
                    background-color: $black;
                    border-color: $black;
                    cursor: not-allowed;

                    &::after {
                        content: 'enter stop location first!';
                        position: absolute;
                        top: 40px;
                        color: $black;
                        left: -22px;
                        font-weight: bold;
                        width: 216px;
                        border-bottom: 3px solid $red;
                    }

                    svg {
                        stroke-width: 2px;
                    }
                }
            }

            svg {
                padding-right: 10px;
            }

            &:hover {
                background-color: $blue;
                border-color: $blue;
                text-decoration: underline;

                svg {
                    stroke-width: 3px;
                }
            }
        }
    }

    &__router-holder {
        padding: 0 40px;
        display: flex;
        justify-content: center;
    }
}
</style>
