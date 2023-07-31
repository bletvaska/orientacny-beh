const CSVDataService = {
    convert: function( data ){
        let result = {
            categories: [],
            results: []
        };

        for(let index in data){
            let item = data[index];
            let category = {
                name: item[0],
                slug: item[0].toLowerCase()
            };

            if(!result.categories.hasOwnProperty(category.slug)){
                result.categories[category.slug] = category;
            }
            if(!result.results.hasOwnProperty(category.slug)){
                result.results[category.slug] = [];
            }

            result.results[category.slug].push( CSVDataService.convertItem(item) );
        }
        return result;
    },
    convertItem: function( item ){
        let club = typeof item[3] !== "undefined" ? item[3] : '-';

        return {
            ranking:        typeof item[1] !== "undefined" ? item[1]: '-',
            racer: {
                name:       typeof item[2] !== "undefined" ? item[2] : '-',
                club:       club.length > 20 ? club.substr(0, 20) + " ..." : club,
                country:    typeof item[4] !== "undefined" ? item[4] : '-'
            },
            time: {
                total:      typeof item[5] !== "undefined" ? item[5] : '-',
                diff:       typeof item[6] !== "undefined" ? item[6] : '-'
            }
        };
    },
    parse: function(strData, strDelimiter){
        strDelimiter = (strDelimiter || ",");
        var objPattern = new RegExp(("(\\" + strDelimiter + "|\\r?\\n|\\r|^)" + "(?:\"([^\"]*(?:\"\"[^\"]*)*)\"|" + "([^\"\\" + strDelimiter + "\\r\\n]*))"), "gi");
        var arrData = [[]];
        var arrMatches = null;
        while (arrMatches = objPattern.exec( strData )){
            var strMatchedDelimiter = arrMatches[ 1 ];
            if (strMatchedDelimiter.length && strMatchedDelimiter !== strDelimiter){
                arrData.push( [] );
            }
            var strMatchedValue;
            if (arrMatches[ 2 ]){
                strMatchedValue = arrMatches[ 2 ].replace(new RegExp( "\"\"", "g" ), "\"");
            } else {
                strMatchedValue = arrMatches[ 3 ];
            }
            arrData[ arrData.length - 1 ].push( strMatchedValue );
        }
        return arrData;
    }
}

const JSONDataService = {
    convert: function( data ){
        let result = {
            categories: [],
            results: []
        };

        for(let index in data){
            let item = data[index];
            let category = {
                name: item.category,
                slug: item.category.toLowerCase()
            };

            if(!result.categories.hasOwnProperty(category.slug)){
                result.categories[category.slug] = category;
            }
            if(!result.results.hasOwnProperty(category.slug)){
                result.results[category.slug] = [];
            }

            result.results[category.slug].push( JSONDataService.convertItem(item) );
        }
        return result;
    },
    convertItem: function( item ){
        let club = typeof item.club !== "undefined" && item.club !== null ? item.club : '-';

        return {
            ranking:        typeof item.pos !== "undefined" ? item.pos: '-',
            racer: {
                name:       typeof item.firstname !== "undefined" ? item.firstname : '-',
                surname:    typeof item.lastname !== "undefined" ? item.lastname : '-',
                club:       club,
                country:    typeof item.country !== "undefined" ? item.country : '-'
            },
            time: {
                total:      typeof item.totaltime !== "undefined" ? item.totaltime : '-',
                diff:       typeof item.behind !== "undefined" ? item.behind : '-'
            }
        };
    },
    parse: function(strData){
        return JSON.parse(strData);
    }
}

const DisplayService = {
    outerWidth: function(el){
        return el.offsetWidth + DisplayService.getHorizontalMargin(el);
    },
    outerHeight: function(el){
        return el.offsetHeight + DisplayService.getVerticalMargin(el);
    },
    getVerticalPadding: function(el, ){
        let style = getComputedStyle(el);
        return parseInt(style.paddingTop) + parseInt(style.paddingBottom);
    },
    getHorizontalPadding: function(el){
        let style = getComputedStyle(el);
        return parseInt(style.paddingLeft) + parseInt(style.paddingRight);
    },
    getVerticalMargin: function(el){
        let style = getComputedStyle(el);
        return parseInt(style.marginTop) + parseInt(style.marginBottom);
    },
    getHorizontalMargin: function(el){
        let style = getComputedStyle(el);
        return parseInt(style.marginLeft) + parseInt(style.marginRight);
    },
    windowViewport: function(){
        return {
            width: window.innerWidth,
            height: window.innerHeight
        }
    },
    appHeight: function(){
        let headerHeight = DisplayService.outerHeight(document.querySelector("#app > .container > .header"));
        let footerHeight = DisplayService.outerHeight(document.querySelector("#app > .container > .footer"));
        let result = {
            header: headerHeight,
            body: window.innerHeight - (headerHeight + footerHeight),
            footer: footerHeight
        }
        return result;
    },
    widgetHeight: function(){
        let bodyHeight = DisplayService.appHeight().body;
        let container = document.querySelector(".view");
        let containerPadding = DisplayService.getVerticalPadding(container);
        return bodyHeight - containerPadding;
    }
}

const StorageService = {
    set: function(name, value){
        localStorage.setItem(name, value);
    },
    get: function(name){
        return localStorage.getItem(name);
    },
    contains: function(name){
        return !!localStorage.getItem(name)
    }
}