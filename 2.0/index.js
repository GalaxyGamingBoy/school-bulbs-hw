var State = /** @class */ (function () {
    function State() {
        this._zapsElem = document.getElementById("stats-zaps-count");
        this._batteryElem = document.getElementById("stats-btr-count");
        this._zaps = 0;
        this._battery = 100;
        this.refresh();
    }
    Object.defineProperty(State.prototype, "zaps", {
        get: function () {
            return this._zaps;
        },
        enumerable: false,
        configurable: true
    });
    Object.defineProperty(State.prototype, "battery", {
        get: function () {
            return this._battery;
        },
        enumerable: false,
        configurable: true
    });
    State.prototype.refresh = function () {
        this._zapsElem.innerText = this._zaps.toString();
        this._batteryElem.innerText = Math.round(this._battery).toString();
        document.documentElement.style.setProperty("--battery-charge", Math.round(this._battery + 20).toString() + "%");
    };
    State.prototype.update = function (battery) {
        this._battery -= (1 - (battery.level * .05));
        this.refresh();
    };
    State.prototype.zapped = function (item, power) {
        this._zaps += item.level;
        this._battery = Math.min(100, this._battery + 1 + power.level * .5);
        this.refresh();
    };
    State.prototype.remove_zaps = function (decr) {
        this._zaps -= decr;
        this.refresh();
    };
    return State;
}());
var ShopItem = /** @class */ (function () {
    function ShopItem(id, cost) {
        this._id = id;
        this._cost = cost;
        this._level = 1;
        this._costElem = document.getElementById("shop-".concat(this._id, "-cost"));
        this.refresh();
    }
    Object.defineProperty(ShopItem.prototype, "level", {
        get: function () {
            return this._level;
        },
        enumerable: false,
        configurable: true
    });
    ShopItem.prototype.refresh = function () {
        this._costElem.innerText = this._cost.toString();
    };
    ShopItem.prototype.buy = function (state) {
        if (state.zaps < this._cost)
            return;
        state.remove_zaps(this._cost);
        this._cost *= 2;
        this._level++;
        this.refresh();
    };
    return ShopItem;
}());
var shopZaps = new ShopItem("zaps", 5);
var shopBattery = new ShopItem("btr", 1);
var shopPower = new ShopItem("pwr", 4);
document.getElementById("shop-zaps-buy").addEventListener("click", function () {
    shopZaps.buy(state);
});
document.getElementById("shop-btr-buy").addEventListener("click", function () {
    shopBattery.buy(state);
});
document.getElementById("shop-pwr-buy").addEventListener("click", function () {
    shopPower.buy(state);
});
var interval;
var state = new State();
// Main Loop
var loop = function () {
    console.log("UPDATE");
    state.update(shopBattery);
    if (state.battery < 1) {
        alert("Game Over!");
        clearInterval(interval);
    }
};
interval = setInterval(loop, 1000);
// Zap
var zap = document.getElementById("clicker");
zap.addEventListener("click", function () {
    state.zapped(shopZaps, shopPower);
});
