<template>
    <div class="breadcrumb-wrapper shadow-sm">
        <div class="breadcrumb-title text-break">
            {{ breadcrumbTitle }}
        </div>
        <div class="breadcrumb-navigation">
            <div v-for="(item, index) in items" :key="index" class="breadcrumb-item text-truncate">
                <router-link :to="{name: item.to || 'dashboard', params: item.params}" :class="{active: index === items.length - 1}">{{ item.title }}</router-link>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: 'PageBreadcrumb',

        props: {
            items: {
                type: Array,
                default: () => []
            }
        },

        computed: {
            breadcrumbTitle() {
                if(this.items.length <= 0) {
                    return ''
                }
                
                return this.items[this.items.length - 1].title
            }
        }
    }
</script>

<style lang="scss" scoped>
.breadcrumb-wrapper {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    padding: 1rem;
    background: #fff;
    border-radius: 10px;
    border: 1px solid var(--light);

    .breadcrumb-title {
        font-size: 16px;
        font-weight: bold;
    }

    .breadcrumb-navigation {
        display: flex;
        max-width: 100%;

        .breadcrumb-item a{
            color: var(--gray);
            max-width: 150px;

            &.active {
                font-weight: bold;
                color: var(--primary)
            }
        }
    }
}
</style>