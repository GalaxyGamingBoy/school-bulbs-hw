class State {
    private _zaps: number;
    private _battery: number;
    private _zapsElem: HTMLParagraphElement;
    private _batteryElem: HTMLParagraphElement;

    constructor() {
        this._zapsElem = document.getElementById("stats-zaps-count") as HTMLParagraphElement;
        this._batteryElem = document.getElementById("stats-btr-count") as HTMLParagraphElement

        this._zaps = 0
        this._battery = 100
        this.refresh()
    }

    get zaps(): number {
        return this._zaps;
    }

    get battery(): number {
        return this._battery
    }

    refresh() {
        this._zapsElem.innerText = this._zaps.toString()
        this._batteryElem.innerText = Math.round(this._battery).toString()
        document.documentElement.style.setProperty("--battery-charge", Math.round(this._battery + 20).toString() + "%")
    }

    update(battery: ShopItem) {
        this._battery -= (1 - (battery.level * .05))
        this.refresh()
    }

    zapped(item: ShopItem, power: ShopItem) {
        this._zaps += item.level;
        this._battery = Math.min(100, this._battery + 1 + power.level * .5)
        this.refresh()
    }

    remove_zaps(decr: number) {
        this._zaps -= decr;
        this.refresh()
    }
}

class ShopItem {
    private _level: number
    private _id: string
    private _costElem: HTMLParagraphElement
    private _cost: number

    constructor(id: string, cost: number) {
        this._id = id;
        this._cost = cost;
        this._level = 1;
        this._costElem = document.getElementById(`shop-${this._id}-cost`) as HTMLParagraphElement;

        this.refresh();
    }

    get level(): number {
        return this._level
    }

    refresh() {
        this._costElem.innerText = this._cost.toString()
    }

    buy(state: State) {
        if (state.zaps < this._cost) return;

        state.remove_zaps(this._cost);
        this._cost *= 2;
        this._level++;
        this.refresh()
    }
}

const shopZaps = new ShopItem("zaps", 5);
const shopBattery = new ShopItem("btr", 1);
const shopPower = new ShopItem("pwr", 4);

(document.getElementById("shop-zaps-buy") as HTMLButtonElement).addEventListener("click", () => {
    shopZaps.buy(state)
});

(document.getElementById("shop-btr-buy") as HTMLButtonElement).addEventListener("click", () => {
    shopBattery.buy(state)
});

(document.getElementById("shop-pwr-buy") as HTMLButtonElement).addEventListener("click", () => {
    shopPower.buy(state)
});

let interval: NodeJS.Timeout
const state = new State();

// Main Loop
const loop = () => {
    console.log("UPDATE")

    state.update(shopBattery)
    if (state.battery < 1) {
        alert("Game Over!")
        clearInterval(interval)
    }
}

interval = setInterval(loop, 1000)

// Zap
const zap = document.getElementById("clicker") as HTMLButtonElement;
zap.addEventListener("click", () => {
    state.zapped(shopZaps, shopPower);
});