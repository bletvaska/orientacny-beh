Vue.component('progress-bar', {
    props: { percentage: Number },
    template: '<div class="progress progress-bar" v-bind:style="{ visibility: percentage != 100 ? \'visible\' : \'hidden\'}"><div class="bar" v-bind:style="{ width: percentage+\'%\'}"></div></div>'
});

Vue.component('results-list', {
    props: {
        items: Array,
        settings: Object
    },
    template: '<ul class="list layout layout-vertical results-list"><li v-for="item in items" class="item"><ul class="list layout layout-horizontal"><li class="data data-ranking">{{ item.ranking }}</li><li class="data data-competitor"><ul class="list layout layout-vertical"><li class="data data-racer"> <ul class="list layout layout-horizontal"><li class="data data-surname">{{ item.racer.surname }}</li><li class="data data-name">{{ item.racer.name }}</li></ul></li><li class="data data-club" v-if="settings.displayClub">{{ item.racer.club }}</li><li class="data data-times"><ul class="list layout layout-horizontal"><li class="data data-time time-total">{{ item.time.total }}</li><li class="data data-time time-diff">{{ item.time.diff }}</li></ul></li></ul></li><li class="data data-country" v-if="settings.displayCountry"><img v-if="hasFlag(item.racer.country)" :src="getFlag(item.racer.country)" alt="flag" :style="{ width: getFlagWidth()}"> <span v-else class="text">{{ item.racer.country }}</span></li></ul></li></ul>',
    methods: {
        hasFlag: function(iso3code){
            return flags.hasOwnProperty(iso3code.toLowerCase());
        },
        getFlag: function(iso3code){
            return flags[iso3code.toLowerCase()];
        },
        getFlagWidth: function(){
            return this.settings.displayClub ? "40px" : "40px";
        }
    }
});

Vue.component('scroll', {
    // up-down for now
    template: '<div :id="uuid" class="scroll"><slot></slot></div>',
    data: function(){
        return {
            uuid: null,
            animation: {
                interval: null,
                direction: "up"
            },
            viewHeight: 0,
            childHeight: 0,
            childCurrentPosition: 0,
            childActiveIndex: 0,
            movesCurrent: 0
        }
    },
    computed: {
        maxScroll: function(){
            return this.childHeight - this.viewHeight;
        }
    },
    watch: {
        // childCurrentPosition: function(){
        //     if(this.animation.direction === "up"){
        //         if(this.childCurrentPosition > this.maxScroll){
        //             this.toggleDirection();
        //         }
        //     }
        //     if(this.animation.direction === "down"){
        //         if(this.childCurrentPosition < 0){
        //             this.toggleDirection();
        //         }
        //     }
        // }
    },
    methods: {
        toggleDirection: function(){
            this.animation.direction = this.animation.direction === 'up' ? 'down' : 'up';
        },
        determineChildHeight: function(){
            this.childHeight = this.$children[0].$el.clientHeight;
        },
        determineParentHeight: function(){
            this.viewHeight = this.$parent.$el.children[2].clientHeight
        }
        // resetScroll
    },
    created: function(){
        this.uuid = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15)
    },
    mounted: function(){
        var self = this;
        setTimeout(function(){
            self.determineChildHeight();
            self.determineParentHeight();
        }, 100);
        window.addEventListener('resize', function(){
            self.determineChildHeight();
            self.determineParentHeight();
        });

        // this.animation.interval = setInterval(function(){
        //     if(self.childHeight > self.viewHeight){
        //         if(self.animation.direction === 'up'){
        //             self.childCurrentPosition += 1;
        //         } else {
        //             self.childCurrentPosition -= 1;
        //         }
        //         self.$children[0].$el.style.marginTop = "-" + self.childCurrentPosition + "px";
        //     } else {
        //         clearInterval(self.animation.interval);
        //     }

        this.animation.interval = setInterval(function(){
            if(self.childHeight > self.viewHeight){
                const $slider = self.$children[0];
                const slides = $slider.$el.childNodes;
                if(typeof slides !== "undefined"){
                    let movesTotal = slides.length;
                    for(let index = 0; index < movesTotal; index++){
                        const slide = slides[index];
                        const slideHeight = slide.clientHeight;
                        if(index < self.movesCurrent){
                            let slideNewPosition = ((movesTotal - self.movesCurrent) * slideHeight) - slideHeight;
                            slide.style.translate = "0px "+slideNewPosition+"px";
                        } else {
                            let slideNewPosition = (self.movesCurrent + 1) * slideHeight;
                            slide.style.translate = "0px -"+slideNewPosition+"px";
                        }
                    }
                    self.movesCurrent = self.movesCurrent < movesTotal ? self.movesCurrent + 1 : 0;
                }
            } else {
                clearInterval(self.animation.interval);
            }
        }, 2000)
    }
});

Vue.component('slider', {
    props: {
        timeout: Number
    },
    template: '<div class="slider"><div class="view"><div class="content"><slot></slot></div></div></div>',
    mounted: function(){
        // var self = this;
        // setInterval(function(){
        //     self.$emit('slide', { direction: 'right'});
        // }, this.timeout);
    }
});

Vue.component('grid', {
    template: '<div class="grid"><div class="view"><div class="content"><slot></slot></div></div></div>'
});

Vue.component('widget', {
    template: '<div class="widget"><div class="header"><slot name="header"></slot></div><div class="body"><slot></slot></div><div class="footer" v-if="!!this.$slots.footer"><slot name="footer"></slot></div></div>',
});