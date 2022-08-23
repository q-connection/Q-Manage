<template>
    <b-list-group class="wiki">
        <b-list-group-item href="#">
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="material-symbols:type-specimen-outline"/>
                </div>
                <div>Spec file</div>
            </div>
        </b-list-group-item>
        <b-list-group-item href="#" active>
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="ic:outline-design-services"/>
                </div>
                <div>Design</div>
            </div>
        </b-list-group-item>
        <b-list-group-item href="#">
            <div class="d-flex align-items-center">
                <div class="h3 mb-0" style="line-height: 1; width: 36px">
                    <q-icon icon="mdi:responsive"/>
                </div>
                <div>Environment testing</div>
            </div>
        </b-list-group-item>
    </b-list-group>
</template>

<script>
    export default {
        name: 'WikiSidebar',
    }
</script>

<style lang="scss" scoped>
.wiki {
    padding-right: .75rem;
    
    .list-group-item {
        border: 0;
        border-bottom: 1px solid rgba(0, 0, 0, 0.125);
        color: #000;

        &.active {
            background: #F8F8F8;
            color: #000
        }
    }
}

@media screen and (max-width: 1024px) {
    .wiki {
        padding: 0
    }
}
</style>