<template>
    <div>
        <div class="dashboard-statistics" :class="{mobile}">
            <div class="row">
                <div class="col-4 p-0">
                    <div class="dashboard-item" style="cursor: pointer" @click="$router.push({name: 'projects'})">
                        <div class="statistics-icon">
                            <q-icon icon="bi:folder-check"/>
                        </div>
                        <div class="statistic-content">
                            <div>PROJECTS</div>
                            <div>{{ $user.total_project || 0 }} projects</div>
                        </div>
                    </div>
                </div>
                <div class="col-4 p-0">
                    <div class="dashboard-item" style="cursor: pointer">
                        <div class="statistics-icon">
                            <q-icon icon="fluent:clipboard-task-list-rtl-24-regular"/>
                        </div>
                        <div class="statistic-content">
                            <div>TASKS</div>
                            <div>{{ $user.total_task || 0 }} tasks</div>
                        </div>
                    </div>
                </div>
                <div class="col-4 p-0">
                    <div class="dashboard-item" style="cursor: pointer">
                        <div class="statistics-icon">
                            <q-icon icon="fluent:bug-prohibited-20-regular"/>
                        </div>
                        <div class="statistic-content">
                            <div>BUGS</div>
                            <div>{{ $user.total_bug || 0 }} bugs</div>
                        </div>
                    </div>
                </div>                      
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        computed: {
            mobile() {
                return this.$device.mobile
            }
        }
    }
</script>

<style lang="scss" scoped>
.dashboard-statistics {
    padding: .75rem;
    margin-bottom: .75rem;

    .row {
        .col-4 {
            &:first-child {
                .dashboard-item {
                    border-top-left-radius: 10px;
                    border-bottom-left-radius: 10px;
                }
            }

            &:last-child {
                .dashboard-item {
                    border-top-right-radius: 10px;
                    border-bottom-right-radius: 10px;
                }
            }     
        }    
    }       
    
    .dashboard-item {
        background-color: #F5F5F5;
        display: flex;
        align-items: center;

        .statistics-icon {
            font-size: 76px;
            color: var(--primary);
            padding-left: 30px;
            padding-right: 24px;
        }

        .statistic-content{
            div {
                &:first-child {
                    font-size: 20px;
                    font-weight: 700;
                }
                &:last-child {
                    font-size: 14px;
                }
            }
        }

        &:hover {
            background-color: rgba(224, 224, 224, 1);
        }
    }    

    &.mobile {
        
        .dashboard-item {
            flex-direction: column;
            justify-content: center;

            .statistic-content {
                text-align: center;

                div {
                    &:first-child {
                        font-size: 16px;
                        font-weight: 600;
                    }
                    &:last-child {
                        font-size: 12px;
                        padding-bottom: .75rem;
                    }
                }
            }

            .statistics-icon {
                font-size: 36px
            }
        }
    }
}
</style>