Module.register("MMM-nevnap", {
    defaults: {
        apiUrl: "https://cors.bridged.cc/https://nevnap.xsak.hu/json.php?",
        retryDelay: 10000
    },
    getScripts: function () {
        return ["moment.js"];
    },
    start: function () {
        day = moment().date();
        names = [];
        subNames = [];
        updated = false;
    },
    getDom: function () {
        var nameWrapper = document.createElement("div");
        
        if (this.names) {
            var namesElement = document.createElement("div");
            namesElement.innerHTML = "";
            namesElement.className = "medium";
            this.names.forEach(name => {
                namesElement.innerHTML += name + "  ";
            });
            nameWrapper.appendChild(namesElement);
        }
        if ( this.subNames) {
            var subNamesElement = document.createElement("div");
            subNamesElement.innerHTML = "";
            subNamesElement.className = "xsmall";
            this.subNames.forEach(subName => {
                subNamesElement.innerHTML += subName + "  ";
            });
            nameWrapper.appendChild(subNamesElement);
        }
        return nameWrapper;
    },
    notificationReceived: function (notification, payload, sender) {
        var self = this;
        if ( notification) {
            Log.log(this + ", " + notification);
        }
        if (notification === "MODULE_DOM_CREATED") {
            Log.log("created nameday");
            self.getNameDay(function (data) {
                        self.names = data.nev1;
                        self.subNames = data.nev2;
                        self.updateDom();
                    });
            self.getMidnight();          
        }
    },
    socketNotificationReceived: function () {},
    
    getMidnight: function(){ 
        
        setInterval( () => {
            var self = this;
            var h = moment().hour();
            if ( h === 0){
                self.getNameDay(function (data) {
                        self.names = data.nev1;
                        self.subNames = data.nev2;
                        self.updateDom();
                    });
            }
        }, 1000*60*60);
     },
    
    getNameDay: function(callback) {
        console.log("getnameday");
        var self = this;
        var retry = true;
        var today = moment();
        var month = today.month() + 1;
        var day = today.date();
        var param = "honap=" + month + "&nap=" + day;
        var url = this.config.apiUrl + param;
        var Request = new XMLHttpRequest();
        Request.open("GET", url, true);
        Request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status < 400 ) {
                    var data = JSON.parse(Request.responseText);
                    callback(data);
                    
                } else {
                    Log.error(self.name + ": Could not load data.");
                }
            }
        };
        Request.setRequestHeader('Content-Type', 'multipart/form-data');
        Request.send();
    },
})
