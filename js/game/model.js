var Model = {
    // Propriétés
    baseLives: 3,
    lives: 0,
    canDie: true,

    // assets
    assetsToLoad: 0,
    assetsLoaded: 0,

    // frames and FPS
    FPS: 60,
    currentFPS: 0,
    frameDuration: null, // milliseconds
    gameAnimationFrame: null,
    now: null,
    then: null,

    // Powerups (the sum of all the probs <= 1)
    powerup_data: {
        // Bonus
        increasePlayerWidth: {
            prob: 1/3.25,
            activationTime: 15, // seconds
            activateAction: null,
            desactivateAction: null,
            powerupsResetAtActivation: ['increasePlayerWidth','decreasePlayerWidth'],
            image: 'assets/powerups/increasePlayerWidth.png'
        },
        tripleBalls: {
            prob: 1/3.25,
            activationTime: 0,
            activateAction: null,
            desactivateAction: null,
            image: 'assets/powerups/tripleBalls.png'
        },
        increasePlayerSpeed: {
            prob: 1/3.25,
            activationTime: 15,
            activateAction: null,
            desactivateAction: null,
            powerupsResetAtActivation: ['increasePlayerSpeed','decreasePlayerSpeed'],
            image: 'assets/powerups/increasePlayerSpeed.png'
        },
        playerShoot: {
            prob: 1/3.25,
            activationTime: 10,
            activateAction: null,
            desactivateAction: null,
            image: 'assets/powerups/playerShoot.png',
            powerupsResetAtActivation: ['playerShoot'],
        },
        // Malus
        decreasePlayerWidth: {
            prob: 1/18,
            activationTime: 15,
            activateAction: null,
            desactivateAction: null,
            powerupsResetAtActivation: ['decreasePlayerWidth','increasePlayerSpeed'],
            image: 'assets/powerups/decreasePlayerWidth.png'
        },
        reverseControls: {
            prob: 1/18,
            activationTime: 15,
            activateAction: null,
            desactivateAction: null,
            image: 'assets/powerups/reverseControls.png',
            powerupsResetAtActivation: ['reverseControls'],
        },
        decreasePlayerSpeed: {
            prob: 1/18,
            activationTime: 15,
            activateAction: null,
            desactivateAction: null,
            powerupsResetAtActivation: ['decreasePlayerSpeed','increasePlayerSpeed'],
            image: 'assets/powerups/decreasePlayerSpeed.png'
        },
        increaseBallSpeed: {
            prob: 1/18,
            activationTime: 15,
            activateAction: null,
            desactivateAction: null,
            powerupsResetAtActivation: ['increaseBallSpeed','decreasePlayerSpeed'],
            image: 'assets/powerups/increaseBallSpeed.png'
        },
        bomb: {
            prob: 1/18,
            activationTime: 0,
            activateAction: null,
            desactivateAction: null,
            image: 'assets/powerups/bomb.png'
        },
    },
    POWERUP_SPEED: 3,
    activePowerups: [],

    // Sons
    soundMuted: false,
    soundsData: {
        BACKGROUND_MUSIC: {
            src: 'sounds/background.mp3',
            loop: true,
            volume: 0.8
        },
        SOUND_PLAYER_COLLISION: {
            src: 'sounds/collision.wav'
        },
        SOUND_ARMOR_COLLISION: {
            src: 'sounds/collision.wav'
        },
        SOUND_DESTROY_BRICK: {
            src: 'sounds/collision.wav'
        },
        SOUND_PLAYER_DEATH: {
            src: 'sounds/playerDeath.wav'
        },
        SOUND_PLAYER_SHOOT: {
            src: 'sounds/playerShoot.wav'
        },
        SOUND_PLAYER_WIN: {
            src: 'sounds/playerWin.wav'
        },
        SOUND_PLAYER_POWERUP: {
            src: 'sounds/playerPowerup.wav'
        },
    },
    sounds: {},

    // États de jeu
    INIT: 0,
    LOADING: 1,
    MENU: 2,
    MENU_READY: 3,
    READY: 4,
    PLAYING: 5,
    END: 6,
    gameState: 0,

    GAME_WIDTH: null,
    GAME_HEIGHT: null,
    GAME_WALL_SIZE: null,

    // Objets du jeu
    player: null,
    canon: null,
    balls: [],
    bricks: [],
    invincibleBricks: [],
    powerups: [],
    missiles: [],
    background: null,

    // Level
    currentLevel: 0,
    map: null,

    // Contrôles du clavier
    controls: {
        left: false,
        right: false,
        space: false
    },

    // Collision
    COLLISION_TOP: 0,
    COLLISION_BOTTOM: 1,
    COLLISION_LEFT: 2,
    COLLISION_RIGHT: 3,

    // Valeurs de base
    ASSET_SIZE_MULTIPLE: 3,
    // background
    BACKGROUND_TYPE: 'background',
    // player
    PLAYER_TYPE: 'player',
    PLAYER_BIG_TYPE: 'playerBig',
    PLAYER_SMALL_TYPE: 'playerSmall',
    PLAYER_X: null,
    PLAYER_Y: null,
    PLAYER_WIDTH: null,
    PLAYER_HEIGHT: null,
    PLAYER_SPEED: 10,
    // ball
    BALL_TYPE: 'ball',
    BALL_X: null,
    BALL_Y: null,
    BALL_WIDTH: null,
    BALL_HEIGHT: null,
    BALL_SPEED: 12,
    BALL_VX: 0.5,
    BALL_VY: -0.5,
    BALL_INCREASE_SPEED: 1.3,
    // brick
    BRICK_TYPE: 'brick',
    BRICK_X_START: null,
    BRICK_Y_START: null,
    BRICK_WIDTH: null,
    BRICK_HEIGHT: null,
    BRICK_ARMOR_INVINCIBLE: 10,
    // missile
    MISSILE_TYPE: 'missile',
    MISSILE_WIDTH: null,
    MISSILE_HEIGHT: null,
    MISSILE_SPEED: 10,
    // canon
    CANON_TYPE: 'canon',

    // Autres
    maxArmorBrick: 10,
    reloadTime: 0.3,
    lastShootTime: 0,


    // Méthodes
    init: function() {
        // Initialise certaines valeurs de base du jeu
        Model.initValues();

        Model.initPowerups();

        // Génération du background
        Model.background = new Asset(Model.BACKGROUND_TYPE, 0, 0, Model.GAME_WIDTH, Model.GAME_HEIGHT);

        Model.loadSounds();
    },

    initPowerups: function() {
        Model.powerup_data.increasePlayerWidth.activateAction = function () {
            Model.player.changeAsset(Model.PLAYER_BIG_TYPE, Model.ASSET_SIZE_MULTIPLE);
        };
        Model.powerup_data.increasePlayerWidth.desactivateAction = function () {
            Model.player.changeAsset(Model.PLAYER_TYPE, Model.ASSET_SIZE_MULTIPLE);
        };

        Model.powerup_data.decreasePlayerSpeed.activateAction = function () {
            Model.player.speed *= 0.7;
        };
        Model.powerup_data.decreasePlayerSpeed.desactivateAction = function () {
            Model.player.speed /= 0.7;
        };

        Model.powerup_data.decreasePlayerWidth.activateAction = function () {
            Model.player.changeAsset(Model.PLAYER_SMALL_TYPE, Model.ASSET_SIZE_MULTIPLE);
        };
        Model.powerup_data.decreasePlayerWidth.desactivateAction = function () {
            Model.player.changeAsset(Model.PLAYER_TYPE, Model.ASSET_SIZE_MULTIPLE);
        };

        Model.powerup_data.increaseBallSpeed.activateAction = function () {
            Model.BALL_SPEED *= Model.BALL_INCREASE_SPEED;
            Model.balls.forEach( (ball) => {

                ball.speed = Model.BALL_SPEED;
            });
        };
        Model.powerup_data.increaseBallSpeed.desactivateAction = function () {
            Model.BALL_SPEED /= Model.BALL_INCREASE_SPEED;
            Model.balls.forEach( (ball) => {
                ball.speed = Model.BALL_SPEED;
            });
        };

        Model.powerup_data.reverseControls.activateAction = function () {
            Model.player.controlsReversed = true;
        };
        Model.powerup_data.reverseControls.desactivateAction = function () {
            Model.player.controlsReversed = false;
        };

        Model.powerup_data.playerShoot.activateAction = function () {
            Model.player.canShoot = true;
        };
        Model.powerup_data.playerShoot.desactivateAction = function () {
            Model.player.canShoot = false;
        };

        Model.powerup_data.increasePlayerSpeed.activateAction = function () {
            Model.player.speed *= 1.5;
        };
        Model.powerup_data.increasePlayerSpeed.desactivateAction = function () {
            Model.player.speed /= 1.5;
        };

        Model.powerup_data.tripleBalls.activateAction = function () {
            Model.balls.forEach((ball) => {
                let vX = ball.velocityX + 2*(2/3);
                if (vX > 1) { vX -= 2 }
                vX = Math.max(vX, 0.8);
                let vY = 1-Math.abs(vX);
                Model.generateBall(ball.x, ball.y, vX, vY);

                vX = ball.velocityX - 2*(2/3);
                if (vX < -1) { vX += 2 }
                vX = Math.max(vX, -0.8);
                vY = 1-Math.abs(vX);
                Model.generateBall(ball.x, ball.y, vX, vY);
            });
        };

        Model.powerup_data.bomb.activateAction = function () {
            Controller.loseLife();
        }
    },

    initValues: function() {
        // game
        Model.lives = Model.baseLives;
        Model.assetsLoaded = 0;
        Model.assetsToLoad = Object.keys(Model.soundsData).length + 1; // All the sounds + 1 graphic board
        Model.currentLevel = 4;
        Model.GAME_WIDTH = window.innerHeight*0.9;
        Model.GAME_HEIGHT = window.innerHeight*0.9;
        Model.GAME_WALL_SIZE = Model.GAME_WIDTH/30;
        Model.ASSET_SIZE_MULTIPLE = (Model.GAME_WIDTH/ASSETS[Model.BACKGROUND_TYPE].sWidth) * 1.51;

        // map
        Model.map = LEVELS[Model.currentLevel];

        // player
        Model.PLAYER_WIDTH = ASSETS[Model.PLAYER_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE;
        Model.PLAYER_HEIGHT = ASSETS[Model.PLAYER_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE;
        Model.PLAYER_X = Model.GAME_WIDTH/2 - (ASSETS[Model.PLAYER_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE) / 2;
        Model.PLAYER_Y = Model.GAME_HEIGHT - Model.GAME_HEIGHT*0.1;

        // ball
        Model.BALL_WIDTH = ASSETS[Model.BALL_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE;
        Model.BALL_HEIGHT = ASSETS[Model.BALL_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE;
        Model.BALL_X = Model.GAME_WIDTH/2 - (ASSETS[Model.BALL_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE) / 2;
        Model.BALL_Y = Model.PLAYER_Y - Model.BALL_HEIGHT;

        // brick
        Model.BRICK_WIDTH = Math.round(ASSETS[Model.BRICK_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE*1.5);
        Model.BRICK_HEIGHT = Math.round(ASSETS[Model.BRICK_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE*1.5);
        Model.BRICK_X_START = Model.GAME_WIDTH/2 - (Model.map[0].length*Model.BRICK_WIDTH)/2;
        Model.BRICK_Y_START = Model.GAME_HEIGHT*0.15;

        // missile
        Model.MISSILE_WIDTH = Math.round(ASSETS[Model.MISSILE_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE);
        Model.MISSILE_HEIGHT = Math.round(ASSETS[Model.MISSILE_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE);

        // canon
        Model.canon = new Canon(Model.CANON_TYPE, 0, 0,ASSETS[Model.CANON_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE, ASSETS[Model.CANON_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE);
    },

    loadSounds: function() {
        for (let [name, data] of Object.entries(Model.soundsData)) {
            Model.sounds[name] = new Howl({
                src: [data.src],
                loop: !!(data.loop),
                volume: (data.volume) ? data.volume : 1,
                onload: Controller.assetsLoaded()
            });
        }
    },

    canPlayGameloop: function() {
        if(Model.frameDuration === null) {
            Model.frameDuration = 1000/Model.FPS;
            Model.then = Date.now();
        }

        Model.now = Date.now();
        let delta = Model.now - Model.then;

        if(delta > Model.frameDuration) {
            Model.then = Model.now - (delta % Model.frameDuration);
            return true;
        }

        return false;
    },

    playSound: function(name) {
        if(Model.soundMuted === true) {
            return;
        }

        if(typeof Model.sounds[name] !== 'undefined') {
            Model.sounds[name].play();
        }
    },

    stopSound: function(name) {
        if(typeof Model.sounds[name] !== 'undefined') {
            Model.sounds[name].stop();
        }
    },

    resizeMap: function() {
        Model.BRICK_X_START = Model.GAME_WIDTH/2 - (Model.map[0].length*Model.BRICK_WIDTH)/2;
    },

    emptyGame: function() {
        Model.player = null;
        Model.balls = [];
        Model.bricks = [];
        Model.powerups = [];
        Model.activePowerups = [];
        Model.missiles = [];
    },

    generateLevel: function() {
        Model.activePowerups.forEach((powerup) => {
            powerup.desactivate();
        });

        Model.balls = [];
        Model.bricks = [];
        Model.powerups = [];
        Model.activePowerups = [];
        Model.missiles = [];

        // Génération du joueur
        Model.player = new Player(
            Model.PLAYER_TYPE,
            Model.PLAYER_X,
            Model.PLAYER_Y,
            Model.PLAYER_WIDTH,
            Model.PLAYER_HEIGHT,
            Model.PLAYER_SPEED
        );

        // Génération d'une balle
        Model.generateBall(Model.BALL_X, Model.BALL_Y);

        // Génération des briques
        Model.resizeMap();
        for (let row=0; row<Model.map.length; row++) {
            for (let col=0; col<Model.map[row].length; col++) {
                if(Model.map[row][col] !== 0) {
                    Model.bricks.push(new Brick(
                        Model.BRICK_TYPE,
                        Model.BRICK_X_START + Model.BRICK_WIDTH * col,
                        Model.BRICK_Y_START + Model.BRICK_HEIGHT * row,
                        Model.BRICK_WIDTH,
                        Model.BRICK_HEIGHT,
                        Model.map[row][col],
                        (Math.random()*Model.maxArmorBrick < Model.map[row][col]) ? Model.selectPowerup() : null
                    ));
                }
            }
        }

        Controller.levelGenerated();
    },

    selectPowerup: function() {
        let powerup = null;
        let bonusRand = Math.random();
        let sumProba = 0;

        for(let [bonusName, bonusInfos] of Object.entries(Model.powerup_data)) {
            if(bonusRand < bonusInfos.prob+sumProba) {
                powerup = bonusName;
                break;
            }
            sumProba += bonusInfos.prob;
        }

        return powerup;
    },

    generateBall: function(x, y, vX = Model.BALL_VX, vY = Model.BALL_VY) {
        Model.balls.push(new Ball(
            Model.BALL_TYPE,
            x,
            y,
            Model.BALL_WIDTH,
            Model.BALL_HEIGHT,
            Model.BALL_SPEED,
            vX,
            vY
        ));
    },

    changeLevel: function(levelNumber) {
        Model.gameState = Model.READY;

        Model.currentLevel = levelNumber;
        Model.map = LEVELS[Model.currentLevel];

        Model.generateLevel();
    },

    getNumberOfNormalBricks: function() {
        return Model.bricks.filter( (brick) => {
            return brick.armor !== Model.BRICK_ARMOR_INVINCIBLE;
        }).length;
    },

    checkLevelCompleted: function() {
        if(Model.getNumberOfNormalBricks() === 0) {
            Model.playSound('SOUND_PLAYER_WIN');
            if(Model.currentLevel+1 >= LEVELS.length) {
                Model.gameState = Model.END;
            }
            else {
                Model.changeLevel(Model.currentLevel+1);
                Controller.increaseLife();
            }
        }
    },

    getCollisionSideOnCanvas: function(element) {
        // left
        if(element.x < Model.GAME_WALL_SIZE) {
            element.x = Model.GAME_WALL_SIZE;
            return Model.COLLISION_LEFT;
        }
        // right
        if(element.x > Model.GAME_WIDTH-element.width-Model.GAME_WALL_SIZE) {
            element.x = Model.GAME_WIDTH-element.width-Model.GAME_WALL_SIZE;
            return Model.COLLISION_RIGHT;
        }
        // top
        if(element.y < Model.GAME_WALL_SIZE) {
            element.y = Model.GAME_WALL_SIZE;
            return Model.COLLISION_TOP;
        }
        // bottom
        if (element.y > Model.GAME_HEIGHT) {
            element.y = Model.GAME_HEIGHT;
            return Model.COLLISION_BOTTOM;
        }

        return false;
    },

    handleCollisionForBall: function(collisionSide, ball) {
        if(collisionSide === Model.COLLISION_TOP || collisionSide === Model.COLLISION_BOTTOM) {
            ball.velocityY = -ball.velocityY
        }
        else if(collisionSide === Model.COLLISION_LEFT || collisionSide === Model.COLLISION_RIGHT) {
            ball.velocityX = -ball.velocityX;
        }
    },

    ballAndPlayerCollision: function(ball) {
        let collisionSide = Model.getCollisionSide(Model.player, ball);
        if(collisionSide !== false) {
            if(collisionSide === Model.COLLISION_TOP) {
                Model.calcNewVelocityforBall(ball);
            }
            else if (collisionSide === Model.COLLISION_RIGHT || collisionSide === Model.COLLISION_LEFT) {
                ball.velocityX = -ball.velocityX;
                ball.velocityY = -Math.abs(ball.velocityY);
            }
            else {
                Model.handleCollisionForBall(collisionSide, ball);
            }

            Model.playSound('SOUND_PLAYER_COLLISION');
        }
    },

    calcNewVelocityforBall: function(ball) {
        ball.velocityX = (((ball.x+ball.width/2)-Model.player.x) / Model.player.width)*1.2 - 0.6;
        ball.velocityY = Model.calcVelocityY(ball.velocityX);
    },

    calcVelocityY: function(velocityX) {
        return -(1-Math.abs(velocityX));
    },

    ballAndBricksCollision: function(ball) {
        for (let i=0; i<Model.bricks.length; i++) {
            let collisionSide = Model.getCollisionSide(Model.bricks[i], ball);
            if(collisionSide !== false) {
                Model.handleCollisionForBall(collisionSide, ball);

                Model.brickCollision(Model.bricks[i], i);

                return true;
            }
        }
    },

    generatePowerupAtBrickPosition: function(brick) {
        var x, width, height;
        if(typeof ASSETS[brick.powerupName].src !== 'undefined') {
            x = (brick.x+brick.width/2) - (ASSETS[brick.powerupName].src[0].sWidth*Model.ASSET_SIZE_MULTIPLE)/2;
            width = ASSETS[brick.powerupName].src[0].sWidth*Model.ASSET_SIZE_MULTIPLE;
            height = ASSETS[brick.powerupName].src[0].sHeight*Model.ASSET_SIZE_MULTIPLE;
        }
        else {
            x = (brick.x+brick.width/2) - (ASSETS[brick.powerupName].sWidth*Model.ASSET_SIZE_MULTIPLE)/2;
            width = ASSETS[brick.powerupName].sWidth*Model.ASSET_SIZE_MULTIPLE;
            height = ASSETS[brick.powerupName].sHeight*Model.ASSET_SIZE_MULTIPLE;
        }
        Model.powerups.push(new Powerup(
            brick.powerupName,
            Model.powerup_data[brick.powerupName].image,
            x,
            brick.y,
            width,
            height,
            Model.POWERUP_SPEED,
            Model.powerup_data[brick.powerupName].activateAction,
            Model.powerup_data[brick.powerupName].desactivateAction,
            Model.powerup_data[brick.powerupName].activationTime,
            Model.powerup_data[brick.powerupName].powerupsResetAtActivation,
        ));
    },

    ballAndCanvasCollision: function(ball) {
        let collisionSide = Model.getCollisionSideOnCanvas(ball);
        if(collisionSide !== false) {
            if(collisionSide === Model.COLLISION_LEFT || collisionSide === Model.COLLISION_RIGHT) {
                ball.velocityX = -ball.velocityX;
            }
            else {
                ball.velocityY = -ball.velocityY;
                if(collisionSide === Model.COLLISION_BOTTOM && Model.canDie === true) {
                    Controller.ballTouchBottom(ball);
                }
            }
        }
    },

    testBallCollisions: function(ball) {
        // Collisions between a ball and the canvas
        if (Model.ballAndCanvasCollision(ball) === true) {
            return true;
        }

        // Collisions between a ball and the player
        if (Model.ballAndPlayerCollision(ball) === true) {
            return true;
        }

        // Collisions between a ball and the bricks
        if (Model.ballAndBricksCollision(ball) === true) {
            return true;
        }
    },

    updateBalls: function() {
        Model.balls.forEach( (ball) => {
            for(let moveStep=0; moveStep<ball.speed; moveStep++) {
                ball.updateAnimation();
                ball.move();

                if(Model.testBallCollisions(ball) === true) {
                    break;
                }
            }
        });
    },

    updatePlayerPosition: function() {
        Model.player.updateAnimation();

        let oldPosition = Model.player.x;
        let movement = 0;

        if(Model.controls.left && !Model.controls.right)
        {
            movement = -1;
        }

        else if(!Model.controls.left && Model.controls.right)
        {
            movement = 1;
        }

        if(Model.player.controlsReversed === true) { movement = -movement }
        var nextPositionX = Model.player.x + movement*Model.player.speed;
        var maxLeftX = Model.GAME_WALL_SIZE;
        var maxRightX = this.GAME_WIDTH-Model.player.width-Model.GAME_WALL_SIZE;

        if(nextPositionX < maxLeftX) {
            Model.player.x = maxLeftX;
        }
        else if(nextPositionX > maxRightX) {
            Model.player.x = maxRightX;
        }
        else {
            Model.player.move(movement);
        }

        if(Model.player.canShoot === true) {
            Model.canon.follow(Model.player);
        }

        // Si la balle n'est pas encore lancée, elle suit le joueur
        if(Model.gameState === Model.READY && Model.balls !== []) {
            Model.balls[0].x += Model.player.x-oldPosition;
        }
    },

    desactivateSomePowerups: function(powerupTypes) {
        Model.activePowerups = Model.activePowerups.filter( (activePowerup, index) => {
            if(powerupTypes.includes(activePowerup.type)) {
                activePowerup.desactivate();
                console.log('desactivate : '+activePowerup.type);
                
                Controller.powerupDesactivated(activePowerup);
                return false;
            }
            return true;
        });
    },

    powerupAndPlayerCollision: function(powerup) {
        let collisionSide = Model.getCollisionSide(Model.player, powerup);
        if(collisionSide !== false) {
            Model.desactivateSomePowerups(powerup.powerupsResetAtActivation);
            let powerupCollected = Model.powerups.splice(Model.powerups.indexOf(powerup), 1)[0];
            powerupCollected.activate();
            Model.activePowerups.push(powerupCollected);
            if(powerupCollected.name !== 'bomb') {
                Model.playSound('SOUND_PLAYER_POWERUP');
            }
            Controller.playerGetPowerup(powerup);
        }
    },

    powerupAndCanvasCollision: function(powerup) {
        let collisionSide = Model.getCollisionSideOnCanvas(powerup);
        if(collisionSide !== false) {
            Model.powerups.splice(Model.powerups.indexOf(powerup), 1);
        }
    },

    manageActivePowerup: function(activePowerup) {
        activePowerup.activationTime -= Model.frameDuration/1000;
        if(activePowerup.activationTime <= 0) {
            activePowerup.desactivate();
            Model.activePowerups.splice(Model.activePowerups.indexOf(activePowerup), 1);
            Controller.powerupDesactivated(activePowerup);
        }
    },

    updatePowerups: function() {
        // Visible Powerups
        Model.powerups.forEach( (powerup) => {
            powerup.updateAnimation();
            powerup.move();

            Model.powerupAndCanvasCollision(powerup);
            Model.powerupAndPlayerCollision(powerup);
        });

        // Active Powerups
        Model.activePowerups.forEach( (activePowerup) => {
            Model.manageActivePowerup(activePowerup);
        });
    },

    getCollisionSide: function(staticObj, movingObj) {
        let dw, dh, vx, vy;

        // Calcul la distance entre les deux rectangles
        vx = (staticObj.x+staticObj.width/2)-(movingObj.x+movingObj.width/2);
        vy = (staticObj.y+staticObj.height/2)-(movingObj.y+movingObj.height/2);

        // Distance min avant collision
        dw = staticObj.width/2 + movingObj.width/2;
        dh = staticObj.height/2 + movingObj.height/2;

        if (Math.abs(vx) < dw) {
            if(Math.abs(vy) < dh){
                // Collision!
                let overlapX = dw - Math.abs(vx);
                let overlapY = dh - Math.abs(vy);

                if (overlapX >= overlapY) {
                    if(vy > 0) {
                        movingObj.y -= overlapY+1;
                        return Model.COLLISION_TOP;
                    }
                    else {
                        movingObj.y += overlapY+1;
                        return Model.COLLISION_BOTTOM;
                    }
                }
                else {
                    if(vx > 0) {
                        movingObj.x -= overlapX+1;
                        return Model.COLLISION_LEFT;
                    }
                    else {
                        movingObj.x += overlapX+1;
                        return Model.COLLISION_RIGHT;
                    }
                }
            }
        }

        return false;
    },

    destroyBall: function (ball) {
        Model.balls.splice(Model.balls.indexOf(ball), 1);
    },

    generateMissile: function() {
        Model.missiles.push(new Missile(
            Model.MISSILE_TYPE,
            Model.player.x+(Model.player.width/2)-(Model.MISSILE_WIDTH/2),
            Model.player.y,
            Model.MISSILE_WIDTH,
            Model.MISSILE_HEIGHT,
            Model.MISSILE_SPEED
        ));
    },

    missileAndCanvasCollision: function(missile, missileIndex) {
        if(Model.getCollisionSideOnCanvas(missile) !== false) {
            Model.missiles.splice(missileIndex, 1);
        }
    },

    brickCollision: function(brick, brickIndex) {
        if(brick.armor !== Model.BRICK_ARMOR_INVINCIBLE) {
            brick.loseArmor();
        }

        if(brick.armor <= 0) {
            if(brick.powerupName !== null) {
                Model.generatePowerupAtBrickPosition(brick);
            }
            Model.bricks.splice(brickIndex, 1);

            Model.checkLevelCompleted();
        }
    },

    missileAndBricksCollision: function(missile, missileIndex) {
        for (let i=0; i<Model.bricks.length; i++) {
            if(Model.getCollisionSide(Model.bricks[i], missile) !== false) {
                Model.missiles.splice(missileIndex, 1);

                Model.brickCollision(Model.bricks[i], i);

                return true;
            }
        }
    },

    tryToGenerateMissile: function() {
        if(Model.player.canShoot && Model.controls.space === true && Model.lastShootTime >= Model.reloadTime) {
            Model.generateMissile();
            Model.playSound('SOUND_PLAYER_SHOOT');
            Model.controls.space = false;
            Model.canShootMissile = false;
            Model.lastShootTime = 0;
        }
    },

    updateMissiles: function () {
        Model.lastShootTime += Model.frameDuration/1000;
        Model.tryToGenerateMissile();

        Model.missiles.forEach( (missile, index) => {
            missile.updateAnimation();
            missile.move(0, -1);

            Model.missileAndCanvasCollision(missile, index);
            Model.missileAndBricksCollision(missile, index);
        });
    }
};
