var View = {
    // Propriétés
    canvas: null,
    context: null,

    assets: null,

    livesNode: null,
    powerupsContainer: null,
    powerupTemplate: null,

    powerupsInfos: {},

    // texts
    currentTextPrinted: null,
    endText: null,
    deathText: null,
    menuText: null,




    // Méthodes
    init: function() {
        View.canvas = document.querySelector('#game');
        View.context = View.canvas.getContext('2d');

        View.canvas.width = Controller.getGameSize().WIDTH;
        View.canvas.height = Controller.getGameSize().HEIGHT;

        View.context.imageSmoothingEnabled = false;

        View.assets = new Image();
        View.assets.onload = function() {
            Controller.assetsLoaded();
        };
        View.assets.src = 'assets/assets.png';

        // nodes
        View.livesNode = document.querySelector('.lives');
        View.powerupsContainer = document.querySelector('.powerupsContainer');
        View.powerupTemplate = document.querySelector('.powerupTemplate');

        // texts
        View.endText = document.querySelector('.endText');
        View.deathText = document.querySelector('.deathText');
        View.menuText = document.querySelector('.menuText');
    },

    bindEvents: function() {
        window.addEventListener('keydown', Controller.handler_keydown);
        window.addEventListener('keyup', Controller.handler_keyup);
    },

    setLives: function(lives) {
        View.livesNode.textContent = lives;
    },

    clearView: function() {
        // Clear canvas
        View.context.clearRect(0, 0, View.canvas.width, View.canvas.height);
    },

    drawImage: function(obj) {
        if (typeof obj.src !== 'undefined') {
            View.drawAnimatedImage(obj);
        }
        else {
            View.context.drawImage(
                View.assets,
                obj.sX,
                obj.sY,
                obj.sWidth,
                obj.sHeight,
                obj.x,
                obj.y,
                obj.width,
                obj.height
            );
        }
    },

    drawAnimatedImage: function(obj) {
        View.context.drawImage(
            View.assets,
            obj.src[Math.round(obj.frameIndex)].sX,
            obj.src[Math.round(obj.frameIndex)].sY,
            obj.src[Math.round(obj.frameIndex)].sWidth,
            obj.src[Math.round(obj.frameIndex)].sHeight,
            obj.x,
            obj.y,
            obj.width,
            obj.height
        );
    },

    drawPowerupInfos: function (powerup) {
        var powerupNode = document.importNode(View.powerupTemplate.content, true).querySelector('.powerup');
        var powerupImg = powerupNode.querySelector('.powerup-img');

        powerupImg.src = powerup.image;

        if(Object.keys(View.powerupsInfos).length < 3) {
            View.powerupsInfos[powerup.type] = View.powerupsContainer.appendChild(powerupNode);
        }
        else {
            powerupNode.dataset.rendered = 'false';
            View.powerupsInfos[powerup.type] = powerupNode;
        }
    },

    updatePowerupInfos: function (powerup) {
        if(View.powerupsInfos[powerup.type]) {
            var powerupLoadbar = View.powerupsInfos[powerup.type].querySelector('.powerup-loadbar');
            var width = (powerup.activationTime / Model.powerup_data[powerup.type].activationTime) * 100;
            powerupLoadbar.style.width = width+'%';
        }
    },

    deletePowerupsInfos: function () {
        View.powerupsInfos = {};
        View.powerupsContainer.innerHTML = '';
    },

    removePowerupInfos: function (powerup) {
        if(View.powerupsInfos[powerup.type]) {
            if(View.powerupsInfos[powerup.type].dataset.rendered !== 'false') {
                View.powerupsContainer.removeChild(View.powerupsInfos[powerup.type]);
            }
            delete View.powerupsInfos[powerup.type];

            if(Object.keys(View.powerupsInfos).length < 3 && Object.keys(View.powerupsInfos).length < 0) {
                var newPowerupName = Object.keys(View.powerupsInfos).pop();
                delete View.powerupsInfos[newPowerupName].dataset.rendered;
                View.powerupsInfos[newPowerupName] = View.powerupsContainer.appendChild(View.powerupsInfos[newPowerupName]);
            }
        }
    },

    showText: function (textNode) {
        View.currentTextPrinted = textNode;
        View.currentTextPrinted.style.display = 'block';
    },

    emptyGame: function () {
        View.clearView();
        View.drawImage(Model.background);
        View.deletePowerupsInfos();
    },

    hideText: function () {
        View.currentTextPrinted.style.display = 'none';
        View.currentTextPrinted = null;
    }
};
