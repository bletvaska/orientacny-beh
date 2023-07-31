window.app = new Vue({
    router: new VueRouter({
        routes: [
            { path: '/:cat', component: { template: '' } }
        ]
    }),
    data: {
        racedata: [],
        categories: [],
        settings: {
            ajax: {
                url: "http://192.168.0.5:8080/api/data",
                interval: 30000,
                timeout: 0
            },
            results: {
                staticPlacesCount: 3,
                displayClub: false,
                displayCountry: true
            }
        },
        countdown: {
            interval: null,
            value: {
                now: null,
                next: null
            },
            percentage: 0
        }
    },
    computed: {},
    watch: {
        racedata: function(){
            // let categories = this.getCategories(this.$route.query.category);
            // if(JSON.stringify(this.categories) !== JSON.stringify(categories)){
            //     this.categories = categories;
            // }
            this.countdownReset();
        },
    },
    methods: {
        loadData: function(firstCall){
            var self = this;
            var xhttp = new XMLHttpRequest();
            xhttp.onreadystatechange = function() {
                if (this.readyState == 4 && this.status == 200) {
                    /* EXPORT IS A CSV */
                    // let data = CSVDataService.parse(this.responseText, ";");
                    // self.racedata = CSVDataService.convert(data);
                    /* EXPORT IS A CSV */

                    /* EXPORT IS A JSON */
                    let data = JSONDataService.parse(this.responseText);
                    self.racedata = JSONDataService.convert(data);
                    /* EXPORT IS A JSON */
                    if(firstCall){
                        self.categories = self.getCategories(self.$route.query.category)
                    }
                }
            };
            xhttp.open("GET", this.settings.ajax.url, true);
            xhttp.send();
        },
        getCategories: function(categories){
            let result = [];
            if(typeof categories === "undefined"){
                for(let key in this.racedata.categories){
                    result.push(this.racedata.categories[key])
                }
            } else if (typeof categories === "string") {
                let categorySlug = categories;
                for(let key in this.racedata.categories){
                    let category = this.racedata.categories[key];
                    if(categorySlug === category.slug){
                        result.push(category);
                    }
                }
            } else {
                for(let index in categories){
                    let categorySlug = categories[index];
                    for(let key in this.racedata.categories){
                        let category = this.racedata.categories[key];
                        if(categorySlug === category.slug){
                            result.push(category);
                        }
                    }
                }
            }
            return result;
        },
        getResults: function(category, start, end){
            let result = [];
            for (let index in this.racedata.results[category]) {
                let shouldPush = false;
                if(index >= start && index < end){ shouldPush = true; }
                if(shouldPush){
                    result.push(this.racedata.results[category][index]);
                }
            }
            return result;
        },
        countdownReset: function(){
            this.countdown.value.next = new Date();
            this.countdown.value.next.setMilliseconds(this.countdown.value.next.getMilliseconds() + this.settings.ajax.interval);
        },
        countdownPercentage: function(){
            let diffSeconds = parseInt((this.countdown.value.next.getTime() - this.countdown.value.now.getTime()) / 1000);
            let percentage = parseInt(100 - (100 * diffSeconds / (this.settings.ajax.interval / 1000)));
            this.countdown.percentage = percentage;
        },
        categoryRotate: function(){
            this.categories.push(this.categories.shift());
        }
    },
    created: function() {
        // check storage for stored settings
        var self = this;
        self.loadData(true);
        setTimeout(function(){
            setInterval(function(){
                self.loadData(false);
            }, self.settings.ajax.interval);
        }, self.settings.ajax.timeout);

        setInterval(function(){
            self.countdown.value.now = new Date();
            self.countdownPercentage();
        }, 1000);
    },
    mounted: function() {

    }
}).$mount('#app');