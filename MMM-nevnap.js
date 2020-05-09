Module.register("MMM-nevnap", {
    defaults: {
        apiUrl: "https://cors-anywhere.herokuapp.com/https://nevnap.xsak.hu/json.php?",
        retryDelay: 10000
    },
    getScripts: function () {
        return ["moment.js"];
    },
    start: function () {
        day = moment().date();
        names = [];
        subNames = [];
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
        if (notification === "DOM_OBJECTS_CREATED") {
            self.getNameDay( function (data) {
                        self.names = data.nev1;
                        self.subNames = data.nev2;
                        Log.log(self.names);
                        Log.log(self.subNames);
                        self.updateDom();
                    });
        }
        if (notification === "CLOCK DATE") {
            if ( self.day != payload ) {
                self.getNameDay( function (data) {
                        self.names = data.nev1;
                        self.subNames = data.nev2;
                        Log.log(self.names);
                        Log.log(self.subNames);
                        self.updateDom();
                    });
            }
        }
    },
    socketNotificationReceived: function () {},
    
    getNameDay: function(callback) {
        var self = this;
        var retry = true;
        var today = moment();
        var month = today.month() + 1;
        var day = today.date();
        var param = "honap=" + month + "&nap=" + day;
        Log.log(month + "," + day );
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
