<template>
    <div>
        <div class="dashboard-statistics" :class="{mobile: $device.mobile === true}">
            <div class="row" v-if="!$device.mobile">
                <div class="col-12 col-xl-4 col-lg-4">
                    <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'projects'})">
                        <img src="/images/icons/projects.png"/>
                        <div class="statistic-content ml-3">
                            <h4 class="mb-1">PROJECTS</h4>
                            <div>4 projects</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-4 col-lg-4">
                    <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'tasks'})">
                        <img src="/images/icons/tasks.png"/>
                        <div class="statistic-content ml-3">
                            <h4 class="mb-1">TASKS</h4>
                            <div>11 tasks</div>
                        </div>
                    </div>
                </div>
                <div class="col-12 col-xl-4 col-lg-4">
                    <div class="d-flex align-items-center p-3" style="cursor: pointer" @click="$router.push({name: 'bugs'})">
                        <img src="/images/icons/bugs.png"/>
                        <div class="statistic-content ml-3">
                            <h4 class="mb-1">BUGS</h4>
                            <div>4 bugs</div>
                        </div>
                    </div>
                </div>                      
            </div>
            <div class="row" v-else>
                <div class="col-4">
                    <div class="p-2 text-cursor text-center" style="cursor: pointer" @click="$router.push({name: 'projects'})">
                        <div>
                            <img src="/images/icons/projects.png"/>
                        </div>
                        <div class="statistic-content mt-2">
                            <div class="font-weight-bold">PROJECTS</div>
                            <div class="statistics-subtitle">4 projects</div>
                        </div>
                    </div>
                </div>
                <div class="col-4">
                    <div class="p-2 text-cursor text-center" style="cursor: pointer" @click="$router.push({name: 'tasks'})">
                        <img src="/images/icons/tasks.png"/>
                        <div class="statistic-content mt-2">
                            <div class="font-weight-bold">TASKS</div>
                            <div class="statistics-subtitle">11 tasks</div>
                        </div>                        
                    </div>                  
                </div>
                <div class="col-4">
                    <div class="p-2 text-cursor text-center" style="cursor: pointer" @click="$router.push({name: 'bugs'})">
                        <img src="/images/icons/bugs.png"/>
                        <div class="statistic-content mt-2">
                            <div class="font-weight-bold">BUGS</div>
                            <div class="statistics-subtitle">4 bugs</div>
                        </div>
                    </div>                      
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        
    }
</script>

<style lang="scss" scoped>
.dashboard-statistics {
    background-color: #F5F5F5;
    border-radius: 10px;
    padding: .5rem;
    margin-bottom: .75rem;

    img {
        height: 63px;
        width: 76px;
        object-fit: contain;
    }

    &.mobile {
        img {
            height: 32px;
            width: 38px
        }

        .statistics-subtitle {
            font-size: 12px
        }
    }
}
</style>