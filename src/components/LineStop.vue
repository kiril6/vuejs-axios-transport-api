<template>
<div class="line-stop">
    <arrow-left-circle-icon @click="goBack" />
    <div id="loader" v-if="this.loading">
        <div class="line-stop--loader"></div>
    </div>

    <template v-else>
        <div class="line-stop__heading">
            <bookmark-icon @click="addFavorite(dataStationObject.name, stationData)" :class="{ bookmarked: bookmarked }" />
            <h3>{{dataStationObject.name}}</h3>
        </div>

        <div class="line-stop__information">
            <ul>
                <li v-for="(item, index) in this.dataStationObject.lines" :key="index">
                    <div>Line: {{item.name}}</div> <span></span>
                    <div>{{item.product}}
                        <div v-if="item.product==='suburban'">
                            <car-icon />
                        </div>
                        <div v-if="item.product==='subway'">
                            <train-icon />
                        </div>
                        <div v-if="item.product==='tram'">
                            <train-icon />
                        </div>
                        <div v-if="item.product==='bus'">
                            <bus-icon />
                        </div>
                        <div v-if="item.product==='ferry'">
                            <ship-icon />
                        </div>
                        <div v-if="item.product==='express'">
                            <train-icon />
                        </div>
                        <div v-if="item.product==='regional'">
                            <train-icon />
                        </div>
                    </div>
                    <div v-if="detailedDataObject.length>0" class="line-stop__information--more-details">
                        <div v-for="(itemTrip, index) in detailedDataObject" :key="index">
                            {{dateFormat(itemTrip.when)}}
                        </div>
                    </div>
                    <div v-else class="line-stop__information--more-details">no departures</div>
                </li>
            </ul>

            <h4>{{stationMap}}</h4>
            <div>
                <iframe width="100%" height="240" frameborder="0" scrolling="no" marginheight="0" marginwidth="0" :src="'https://maps.google.com/maps?q='+dataStationObject.location.latitude+','+dataStationObject.location.longitude+'&hl=es&z=14&amp;output=embed'">
                </iframe>
                <br />
                <small>
                    <a :href="'https://maps.google.com/maps?q='+dataStationObject.location.latitude+','+dataStationObject.location.longitude+'&hl=es;z=14&amp;output=embed'" rel="external" style="color:#0000FF;text-align:left" target="_blank">
                        <arrows-maximize-icon />
                    </a>
                </small>
            </div>
        </div>
    </template>
</div>
</template>

<script>
export default {
    name: 'LineStop',
    data() {
        return {
            dataStationObject: [],
            detailedDataObject: [],
            stationMap: 'Station Location',
            loading: false,
            bookmarked: false
        }
    },
    mounted() {
        this.getStation()
        this.getDetailedData()
    },
    methods: {
        getStation: function () {
            this.loading = true
            this.axios.get('https://v5.vbb.transport.rest/stations/' + this.stationData)
                .then(response => this.dataStationObject = response.data)
                .catch(function (error) {
                    console.log(error);
                }).finally(() => this.loading = false);
        },

        getDetailedData() {
            this.axios.get('https://v5.vbb.transport.rest/stops/' + this.stationData + '/departures')
                .then(response => this.detailedDataObject = response.data)
                .catch(function (error) {
                    console.log(error);
                })
        },

        addFavorite(name, id) {
            if (!this.bookmarked) {
                this.favoritesData.push(name + '/' + id)
                this.bookmarked = true
                if (!this.$favorites.opened) {
                    this.$favorites.open()
                }
            }
        },

        dateFormat(item) {
            return 'date: ' + item.split('T')[0].slice(8, 10) + '/' + item.split('-', 2)[1] + ' | time: ' + item.split('T').reverse()[0].slice(0, 5)
        },

        goBack() {
            this.$router.go(-1)
        }
    },
    props: {
        stationData: {
            type: String,
            default: ''
        },
        favoritesData: {
            type: Array,
            required: true,
            default: null
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/color.scss";

.line-stop {
    padding: 60px 0 0 0;
    width: 80%;

    >svg {
        height: 38px;
        width: 38px;
        cursor: pointer;
        margin: -34px 0 0 -50px;

        &:hover {
            stroke: $lightBlue;
        }
    }

    #loader {
        display: flex;
        justify-content: center;
    }

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

    &__heading {
        display: flex;
        align-items: center;

        svg {
            margin-right: 20px;
            cursor: pointer;

            &:hover {
                stroke: $lightBlue;
            }
        }
    }

    &__information {

        ul {
            list-style-type: none;
            text-align: left;
            font-weight: bold;
            border: 2px solid $blue;
            border-radius: .25rem;
            margin-inline-start: 0;
            padding-inline-start: 0;
            height: calc(50vh - 40px);
            overflow-y: auto;

            li {
                padding: 10px 24px 10px 10px;
                transition: all 0.3s ease-out;
                display: flex;
                justify-content: space-between;
                align-items: center;
                flex-wrap: wrap;

                span {
                    cursor: pointer;
                }

                svg {
                    float: right;
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

        &--more-details {
            width: 100%;
        }

        iframe {
            border: 2px solid #003082;
            border-radius: .25rem;

            &:hover {
                border-color: $lightBlue;
            }
        }
    }
}
</style>
