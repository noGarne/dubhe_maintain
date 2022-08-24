<template>
    <div class="app-container" ref="appContainer">
        <!-- banner栏 -->
        <el-row class="banner">
            <img src="@/assets/image/index/banner.jpg" alt="banner">
        </el-row>

        <!-- 简介块 -->
        <el-row class="brief">
            <div class="briefCont">
                <el-image class="img" :src="require('@/assets/image/index/bg.png')" fit="cover"></el-image>
                <div class="cont-txt">
                    <div class="brief-title">INTRODUCTION</div>
                    <div class="line-style"></div>
                    <div class="text-info">
                        <span class="txt-style">π-HuB</span>
                        <span>project aims to bring balance to the Biology/Disease-centric HPP, with the overarching goals 1) to dissect the human body into a hierarchy (from tissues/organs to single cells) of digital reference space of the proteome; 2)To trace protein-centric lineage trajectories in development,healthy aging, progression of complex diseases (e.g., cancers, neurodegeneration, cardiovascular diseases).</span>
                    </div>
                </div>
            </div>
        </el-row>

        <!-- 活动块 -->
        <el-row class="activities" :class="isSmallScreen ? 'small-activities':''">
            <div class="title">News & Events</div>
            <div class="activitiesCont cont-width">
                <div class="listBox">
                    <div class="list" v-for="(item,index) in activitiesList" :key="index"
                         @click="toPage('newsDetail',{breadcrumbData: {name: 'home',path:'/Home'}})">
                        <div class="subtitle">{{ item.title }}</div>
                        <p>{{ item.content }}</p>
                    </div>
                </div>
                <!-- 小轮播图 -->
                <div class="img-style">
                    <el-carousel type="card" :height="isSmallScreen ? '294px':'491px'" :autoplay="false" arrow="always" :interval="5000" indicator-position="none">
                        <el-carousel-item @click="toPage('eventsDetail')">
                            <img src="@/assets/image/index/carousel1.png" @click="detailFun()"/>
                        </el-carousel-item>
                        <el-carousel-item @click="toPage('eventsDetail')">
                            <img src="@/assets/image/index/carousel2.png" @click="detailFun()"/>
                        </el-carousel-item>
                        <el-carousel-item @click="toPage('eventsDetail')">
                            <img src="@/assets/image/index/carousel3.png" @click="detailFun()"/>
                        </el-carousel-item>
                    </el-carousel>
                </div>
            </div>
        </el-row>

        <!-- 设施模块 -->
        <el-row class="facilities">
            <div class="title">Facilities</div>

            <el-carousel trigger="click" arrow="never" height="calc(100vh - 90px)" :autoplay="false">
                <el-carousel-item v-for="item in 3" :key="item">
                    <div class="facilities-opacity"></div>
                    <img src="@/assets/image/index/facilities1.png" alt="图片">
                    <div class="cont">
                        <div class="title">About Us</div>
                        <div class="text">Lorem ipsum dolor sit amet, in ipsum laoreet copiosae est. Hinc tation eirmod
                            ei est, nec ei modo sumo aliquid,
                        </div>
                    </div>
                </el-carousel-item>
            </el-carousel>
        </el-row>
    </div>
</template>

<script>
export default {
    name: "index",
    components: {},
    data() {
        return {
            activitiesList: [{
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }, {
                title: 'From Conventional to sEAMANTIC',
                content: '20/07-26/07'
            }],
            scrollObj: ['.banner', '.brief', '.activities', '.facilities', '.footer-box'],
            scrollIndex: 1,
            isFun: true,
            // 是不是小屏幕
            isSmallScreen: false,
        }
    },
    created() {
        if (this.getClientHeight() <= 757){
            this.isSmallScreen = true;
            this.activitiesList = this.activitiesList.slice(0,6);
        }
    },
    mounted() {
        //监听鼠标滚动事件
        window.addEventListener('mousewheel', this.handleScroll);
        // 禁用滚动条
        this.disableScroll();
    },
    methods: {
        detailFun() {
            this.$router.push({name: 'eventsDetail'})
        },
        // 滚动事件
        ddads(e) {
            console.log(e)
            if (this.isFun) {
                let direction = e.deltaY > 0 ? 'down' : 'up';  //deltaY为正则滚轮向下，为负滚轮向上
                if (direction === 'down') {
                    this.scrollIndex === 5 ? '' : this.scrollIndex++;
                }
                if (direction === 'up') {
                    this.scrollIndex !== 1 ? this.scrollIndex-- : '';
                }

                if (this.scrollIndex === 5) {
                    this.toBottom()
                } else {
                    // this.$el.querySelector(this.scrollObj[this.scrollIndex-1]).scrollIntoView({ block: "start", behavior: "smooth" });
                    window.scrollTo({
                        // y方向坐标800px（代码中不需要写明单位）
                        top: this.$el.querySelector(this.scrollObj[this.scrollIndex - 1]).offsetTop - 90,
                        // 滚动方式是平滑滚动 默认是auto 即instant 直接跳到目标位置  不常用
                        behavior: "smooth",
                    });
                }

                // 防抖
                this.isFun = false;
                setTimeout(function () {
                    this.isFun = true;
                }.bind(this), 800)
            }
        },
        //禁止滚动
        disableScroll() {
            let mo = function (e) {
                e.preventDefault();
            };
            document.body.style.overflow = 'hidden';
            document.addEventListener("touchmove", mo, false);//禁止页面滑动
        },
        // 滚动到底部
        toBottom() {
            let height = document.body.clientHeight;
            window.scroll({top: height, left: 0, behavior: 'smooth'});
        },
        getClientHeight() {
            var clientHeight = 0;
            if (document.body.clientHeight && document.documentElement.clientHeight) {
                var clientHeight = (document.body.clientHeight < document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            } else {
                var clientHeight = (document.body.clientHeight > document.documentElement.clientHeight) ? document.body.clientHeight : document.documentElement.clientHeight;
            }
            return clientHeight;
        }

    },
    beforeDestroy() {
        let mo = function (e) {
            e.preventDefault();
        };
        document.body.style.overflow = 'auto';
        document.addEventListener("touchmove", mo, true);//解除禁止页面滑动
        // 移除监听
        window.removeEventListener('mousewheel', this.handleScroll);
    }
}
</script>

<style scoped lang="scss">
// banner图
.banner {
    height: calc(100vh - 90px);

    img {
        width: 100%;
        height: 100%;
    }
}

// 简介块
.brief {
    height: calc(100vh - 90px);
    font-family: Regular;
    position: relative;
    overflow: hidden;

    // 现有模块样式
    .briefCont {
        width: 1200px;
        margin: 0 auto;
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translateY(-50%) translateX(-50%);

        .img {
            max-height: 752px;
            width: 713px;
            height: calc(100vh - 90px);
            padding-left: 300px;
        }

        .cont-txt {
            position: absolute;
            top: 66px;

            .brief-title {
                font-size: 40px;
                font-weight: 500;
                line-height: 79px;
                letter-spacing: 0px;
                color: #01000E;
            }

            .line-style {
                width: 598px;
                height: 10px;
                background: #1A3295;
                margin-left: 25px;
            }

            .text-info {
                width: 1088px;
                height: 372px;
                font-size: 20px;
                font-weight: normal;
                line-height: 62px;
                letter-spacing: 1.6px;
                text-align: justify;
                margin-left: 79px;
                margin-top: 90px;

                .txt-style {
                    font-family: Bold;
                    font-size: 40px;
                    line-height: 60px;
                    color: #002088;
                }
            }
        }
    }
}

// 活动块
.activities {
    height: calc(100vh - 90px);
    background: url("../../assets/image/index/activitiesBg.jpg") no-repeat center;
    background-size: 100% 100%;
    overflow: hidden;

    .activitiesCont {
        margin-top: 85px;
        display: flex;

        .list {
            width: 448px;
            color: #FFFFFF;
            padding-bottom: 8px;
            box-sizing: border-box;
            position: relative;
            margin-bottom: 40px;
            font-family: Regular;
            display: flex;
            justify-content: space-between;
            cursor: pointer;

            .subtitle {
                font-size: 20px;
                font-weight: normal;
                letter-spacing: 0;
            }

            p {
                font-size: 16px;
                font-weight: normal;
                letter-spacing: 0;
                // width:450px;
                white-space: nowrap;
                overflow: hidden;
                text-overflow: ellipsis;
                margin-top: 7px;
            }
        }

        .list::after {
            content: '';
            width: 448px;
            height: 1px;
            background-color: #FFFFFF;
            position: absolute;
            bottom: 0;
            left: 6px;
        }


        .more {
            font-size: 20px;
            font-weight: 500;
            line-height: 24px;
            letter-spacing: 0px;
            color: #FFFFFF;
            margin-top: -25px;
            margin-left: auto;
            margin-right: 5px;
            width: max-content;
            cursor: pointer;
            display: flex;
            align-items: center;

            img {
                width: 24px;
                height: 7.43px;
                margin-left: 10px;
            }
        }
    }
}

// 小屏幕适配
.small-activities {
    .activitiesCont .list {
        margin-bottom: 18px;
    }
}

// 设施块
.facilities {
    position: relative;
    height: calc(100vh - 90px);
    overflow: hidden;

    .title {
        position: absolute;
        z-index: 4;
        width: 100%;
        text-align: center;
    }

    .facilities-opacity {
        position: absolute;
        width: 100%;
        height: calc(100vh - 90px);
        background-color: rgba(0, 0, 0, 0.2);
        z-index: 3;
    }

    img {
        width: 100%;
        height: 100%;
    }

    .cont {
        width: 412px;
        position: absolute;
        z-index: 4;
        bottom: 142px;
        left: 19%;

        .title {
            margin-top: 0;
            left: 0;
            transform: none;
            width: max-content;
        }

        .title::after {
            width: 166px;
            top: 60px;
        }

        .text {
            font-size: 16px;
            line-height: 30px;
            color: #FFFFFF;
            margin-top: 80px;
        }
    }
}

// 标题
.title {
    margin-top: 56px;
    color: #FFFFFF;
    font-size: 40px;
    font-weight: bold;
    font-family: Bold;
    text-align: center;
    position: relative;
    letter-spacing: 0;
}

.title::after {
    content: '';
    width: 178px;
    height: 4px;
    background-color: #FFFFFF;
    position: absolute;
    top: 75px;
    left: 50%;
    transform: translateX(-50%);
}
</style>

<style lang="scss">
// 活动块轮播
.activities {
    .img-style {
        width: 654px;
        margin-left: 52px;

        img {
            width: 100%;
        }

        .el-carousel__item {
            height: 358px;
            top: 60px;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }
    }

    .is-active {
        transform: translateX(105px) scale(1) !important;
        width: 445px;
        height: 481px !important;
        top: 0 !important;
    }

    .el-carousel__arrow {
        width: 60px;
        height: 60px;
        font-size: 30px;
    }
}

// 小屏幕适配
.small-activities {
    .img-style {
        width: 500px;
        margin-left: 125px;

        img {
            width: 100%;
        }

        .el-carousel__item {
            height: 190px;
            top: 48px;
        }

        .el-carousel__item:nth-child(2n) {
            background-color: #99a9bf;
        }

        .el-carousel__item:nth-child(2n+1) {
            background-color: #d3dce6;
        }

        .is-active {
            transform: translateX(105px) scale(1) !important;
            width: 259px;
            height: 294px !important;
            top: 0 !important;
        }
    }

    .el-carousel__arrow {
        width: 60px;
        height: 60px;
        font-size: 30px;
    }
}

.facilities {
    .el-carousel__indicators--horizontal {
        z-index: 6;
        bottom: 30px;
    }

    .el-carousel__button {
        width: 10px;
        height: 10px;
        opacity: 1;
        border-radius: 50%;
    }

    .el-carousel__indicator.is-active button {
        background-color: #0022CD;
    }

    .el-carousel__indicator--horizontal {
        padding: 12px 10px;
    }
}
</style>



// WEBPACK FOOTER //
// src/views/home/index.vue