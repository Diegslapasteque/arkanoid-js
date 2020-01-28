class Asset {
    constructor(type, x, y, width, height) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._width = width;
        this._height = height;
        this._sX = ASSETS[type].sX;
        this._sY = ASSETS[type].sY;
        this._sWidth = ASSETS[type].sWidth;
        this._sHeight = ASSETS[type].sHeight;
    }

    get x() {
        return this._x;
    }

    set x(value) {
        this._x = value;
    }

    get y() {
        return this._y;
    }

    set y(value) {
        this._y = value;
    }

    get width() {
        return this._width;
    }

    set width(value) {
        this._width = value;
    }

    get height() {
        return this._height;
    }

    set height(value) {
        this._height = value;
    }

    get sX() {
        return this._sX;
    }

    set sX(value) {
        this._sX = value;
    }

    get sY() {
        return this._sY;
    }

    set sY(value) {
        this._sY = value;
    }

    get sWidth() {
        return this._sWidth;
    }

    set sWidth(value) {
        this._sWidth = value;
    }

    get sHeight() {
        return this._sHeight;
    }

    set sHeight(value) {
        this._sHeight = value;
    }
}

class MoveAsset extends Asset {
    constructor(type, x, y, width, height, speed) {
        super(type, x, y, width, height);
        this._speed = speed;
    }

    get speed() {
        return this._speed;
    }

    set speed(value) {
        this._speed = value;
    }
}

class Player extends MoveAsset {
    constructor(type, x, y, width, height, speed) {
        super(type, x, y, width, height, speed);
        this._isAlive = true;
    }

    get isAlive() {
        return this._isAlive;
    }

    set isAlive(value) {
        this._isAlive = value;
    }

    move(move) {
        this.x += move*this.speed;
    }
}

class Ball extends MoveAsset {
    constructor(type, x, y, width, height, speed) {
        super(type, x, y, width, height, speed);
        this._velocityX = 0.5;
        this._velocityY = -0.5;
    }

    get velocityX() {
        return this._velocityX;
    }

    set velocityX(value) {
        this._velocityX = value;
    }

    get velocityY() {
        return this._velocityY;
    }

    set velocityY(value) {
        this._velocityY = value;
    }

    move() {
        this.x += this.velocityX;
        this.y += this.velocityY;
    }
}

class Brick extends Asset {
    constructor(type, x, y, width, height, armor, powerup) {
        super(type, x, y, width, height);
        this._armor = armor;
        this._powerup = powerup;
        this.reloadAsset();
    }

    get armor() {
        return this._armor;
    }

    set armor(value) {
        this._armor = value;
    }

    get powerup() {
        return this._powerup;
    }

    loseArmor() {
        this.armor--;
        if (this.armor !== 0) {
            this.reloadAsset()
        }
    }

    reloadAsset() {
        this.sX = this._sWidth * (this.armor-1);
    }
}
