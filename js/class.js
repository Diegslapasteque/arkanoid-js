class Asset {
    constructor(type, x, y, width, height) {
        this._x = Math.round(x);
        this._y = Math.round(y);
        this._width = Math.round(width);
        this._height = Math.round(height);

        if(typeof ASSETS[type].src !== 'undefined') {
            this._src = ASSETS[type].src;
            this._frameIndex = 0;
            this._frameSpeed = ASSETS[type].frameSpeed;
        }
        else {
            this._sX = ASSETS[type].sX;
            this._sY = ASSETS[type].sY;
            this._sWidth = ASSETS[type].sWidth;
            this._sHeight = ASSETS[type].sHeight;
        }
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

    get src() {
        return this._src;
    }

    set src(value) {
        this._src = value;
    }

    get frameIndex() {
        return this._frameIndex;
    }

    set frameIndex(value) {
        this._frameIndex = value;
    }

    get frameSpeed() {
        return this._frameSpeed;
    }

    set frameSpeed(value) {
        this._frameSpeed = value;
    }

    changeAsset(type, assetSizeMultiple) {
        this._width = Math.round(ASSETS[type].sWidth*assetSizeMultiple);
        this._height = Math.round(ASSETS[type].sHeight*assetSizeMultiple);

        if(typeof ASSETS[type].src !== 'undefined') {
            this._src = ASSETS[type].src;
        }
        else {
            this._sX = ASSETS[type].sX;
            this._sY = ASSETS[type].sY;
            this._sWidth = ASSETS[type].sWidth;
            this._sHeight = ASSETS[type].sHeight;
        }
    }

    updateAnimation() {
        if(typeof this.src !== 'undefined') {
            this.frameIndex += this.frameSpeed;
            if(Math.round(this.frameIndex) >= this.src.length) {
                this.frameIndex = 0;
            }
        }
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

    move(moveX, moveY) {
        this.x += moveX*this.speed;
        this.y += moveY*this.speed;
    }
}

class Player extends MoveAsset {
    constructor(type, x, y, width, height, speed, canShoot = false, controlsReversed = false) {
        super(type, x, y, width, height, speed);
        this._canShoot = canShoot;
        this._controlsReversed = controlsReversed
    }

    get canShoot() {
        return this._canShoot;
    }

    set canShoot(value) {
        this._canShoot = value;
    }

    get controlsReversed() {
        return this._controlsReversed;
    }

    set controlsReversed(value) {
        this._controlsReversed = value;
    }

    move(move) {
        this.x += move*this.speed;
    }
}

class Ball extends MoveAsset {
    constructor(type, x, y, width, height, speed, vX, vY) {
        super(type, x, y, width, height, speed);
        this._velocityX = vX;
        this._velocityY = vY;
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

class Powerup extends MoveAsset {
    constructor(type, image, x, y, width, height, speed, activateAction, desactivateAction = null, activationTime = 0, powerupsResetAtActivation = []) {
        super(type, x, y, width, height, speed);
        this._type = type;
        this._image = image;
        this._activateAction = activateAction;
        this._desactivateAction = desactivateAction;
        this._activationTime = activationTime;
        this._powerupsResetAtActivation = powerupsResetAtActivation;
    }

    get type() {
        return this._type;
    }

    get activationTime() {
        return this._activationTime;
    }

    set activationTime(value) {
        this._activationTime = value;
    }

    get powerupsResetAtActivation() {
        return this._powerupsResetAtActivation;
    }

    get image() {
        return this._image;
    }

    move() {
        this.y += this.speed;
    }

    activate() {
        this._activateAction();
    }

    canBeDesactivated() {
        return this._desactivateAction !== null;
    }

    desactivate() {
        if(this.canBeDesactivated()) {
            this._desactivateAction();
        }
    }
}

class Missile extends MoveAsset {
    constructor(type, x, y, width, height, speed) {
        super(type, x, y, width, height, speed);
    }
}

class Canon extends Asset {
    constructor(type, x, y, width, height) {
        super(type, x, y, width, height);
    }

    follow(sprite) {
        this.x = sprite.x+sprite.width/2-this.width/2;
        this.y = sprite.y-this.height;
    }
}

class Brick extends Asset {
    constructor(type, x, y, width, height, armor, powerupName) {
        super(type, x, y, width, height);
        this._armor = armor;
        this._powerupName = powerupName;
        this.reloadAsset();
    }

    get armor() {
        return this._armor;
    }

    set armor(value) {
        this._armor = value;
    }

    get powerupName() {
        return this._powerupName;
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
