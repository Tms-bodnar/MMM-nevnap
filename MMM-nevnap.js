Module.register("MMM-nevnap", {
    defaults: {
        apiUrl: "http://xsak.hu/nevnap/json.php?",
        retryDelay: 10000
    },
    getScripts: function () {
        return ["moment.js"];
    },
    start: function () {},
    getDom: function () {
        var nameWrapper = document.createElement("div");
        var namesElement = document.createElement("div");
        namesElement.innerHTML = "";
        namesElement.className = "medium";
        this.names.forEach(name => {
            namesElement.innerHTML += name + "  ";
        });
        nameWrapper.appendChild(namesElement);
        var subNamesElement = document.createElement("div");
        subNamesElement.innerHTML = "";
        subNamesElement.className = "xSmall";
        this.subNames.forEach(subName => {
            subNamesElement.innerHTML += subname + "  ";
        });
        var br = document.createElement("br");
        nameWrapper.appendChild(br);
        nameWrapper.appendChild(subNamesElement);
        return element;
    },
    notificationReceived: function () {},
    socketNotificationReceived: function () {},
    getNameDay() {
        var today = moment();
        var month = today.month();
        var day = today.day();
        var param = "honap=" + month + "?nap=" + day;
        var url = this.config.apiUrl + param;
        var Request = new XMLHttpRequest();
        Request.open("GET", url, true);
        Request.onreadystatechange = function () {
            if (this.readyState === 4) {
                if (this.status === 200) {
                    self.processNameday(JSON.parse(this.response));
                } else {
                    Log.error(self.name + ": Could not load data.");
                }

                if (retry) {
                    self.scheduleUpdate((self.loaded) ? -1 : self.config.retryDelay);
                }
            }
        };
        Request.send();
    },

    processNameday(data) {
        var names = data.nev1;
        var subNames = data.nev2;
    }
})