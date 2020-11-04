<template>
<div class="favorites">

    <div class="favorites__title">
        {{title}}
        <arrow-bar-left-icon @click="$favorites.open" />
    </div>

    <ul class="favorites__nav-items">

        <router-link tag="li" :to="{ name: 'LineStop', params: {id: item.split(/[/ ]+/).reverse()[0]} }" v-for="(item, index) in favoritesList" :key="index">
            <div>
                <star-icon class="icon-on" />
                <star-off-icon class="icon-off" @click.prevent="removeFavorite(index)" />
            </div>

            {{item.split('/')[0]}}

        </router-link>
    </ul>

</div>
</template>

<script>
export default {
    name: 'Favorites',
    data() {
        return {
            title: 'Favorites'
        }
    },
    props: {
        favoritesList: {
            type: Array,
            required: true,
            default: null
        }
    },

    methods: {
        removeFavorite(index) {
            this.favoritesList.splice(index, 1);
        }
    }
}
</script>

<style lang="scss" scoped>
@import "@/assets/styles/color.scss";

.favorites {
    position: relative;
    min-height: 689px;
    height: 100vh;
    width: 250px;
    background: $white;
    box-shadow: inset -4px 0px 22px 0px rgba(50, 50, 50, 0.69);

    &__title {
        padding: 29px 8px 36px 12px;
        font-size: 21px;
        font-weight: 500;
        display: flex;
        justify-content: space-between;
        align-items: center;

        svg {
            cursor: pointer;
            transition: all 0.5s ease-out;

            &:hover {
                padding-right: 5px;
            }
        }

        a:link,
        a:hover,
        a:visited,
        a:active {
            color: $black;
            text-decoration: none;
        }
    }

    &__nav-items {
        list-style: none;
        margin: 0;
        padding-inline-start: 0;
        height: calc(100vh - 150px);
        overflow-y: auto;

        li {
            font-weight: 400;
            font-size: 14px;
            line-height: 24px;
            height: 48px;
            display: flex;
            align-items: center;
            border-left: 4px solid transparent;
            padding-left: 10px;

            &:hover {
                border-left: 4px solid $blue;
                border-bottom: 1px dashed $lightBlue;
                cursor: pointer;
            }

            &.router-link-active {
                border-left: 4px solid $lightBlue;
                text-decoration: none;

                &::after {
                    content: '>';
                    position: absolute;
                    right: 18px;
                    color: $blue;
                    font-weight: bold;
                }
            }

            svg {
                height: 18px;
                width: 18px;
                padding-right: 11px;

                &:hover {
                    stroke: $red;
                }
            }

            div {
                height: 20px;

                .icon-off {
                    display: none;
                }

                &:hover {
                    .icon-on {
                        display: none;
                    }

                    .icon-off {
                        display: block;
                    }
                }
            }

            a:link,
            a:hover,
            a:visited,
            a:active {
                color: $black;
                text-decoration: none;
            }
        }

    }
}
</style>
