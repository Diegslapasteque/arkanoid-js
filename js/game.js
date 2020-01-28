// var Game = (function() {
    var Model = {
        // Propriétés
        lives: 3,
        FPS: 60,
        gameAnimationFrame: null,

        // Powerups
        POWERUP_PROBABILITY: 0.3,
        BONUS_PROBABILITY: 0.7,
        // bonus (the sum of the probabilities needs to be equal to 1)
        BONUS_DATA: {
            'increasePlayerWidth': {
                prob: 0.25,
                callback: 'Model.activateIncreasePlayerWidth'
            },
            'tripleBalls': {
                prob: 0.25,
                callback: 'Model.activateTripleBalls'
            },
            'increasePlayerSpeed': {
                prob: 0.25,
                callback: 'Model.activateIncreasePlayerSpeed'
            },
            'playerShoot': {
                prob: 0.25,
                callback: 'Model.activatePlayerShoot'
            },
        },
        MALUS_DATA: {
            'decreasePlayerWidth': {
                prob: 0.25,
                callback: 'Model.activateDecreasePlayerWidth'
            },
            'inverseControls': {
                prob: 0.25,
                callback: 'Model.activateInverseControls'
            },
            'decreasePlayerSpeed': {
                prob: 0.25,
                callback: 'Model.activateDecreasePlayerSpeed'
            },
            'increaseBallSpeed': {
                prob: 0.25,
                callback: 'Model.activateIncreaseBallSpeed'
            },
        },

        // Sons
        soundMuted: true,
        SOUND_PLAYER_COLLISION: 'sounds/collision.wav',
        SOUND_ARMOR_COLLISION: 'sounds/collision.wav',
        SOUND_DESTROY_BRICK: 'sounds/collision.wav',
        sounds: [],

        // États de jeu
        INIT: 0,
        LOADING: 1,
        MENU: 2,
        MENU_READY: 3,
        READY: 4,
        PLAYING: 5,
        OVER: 6,
        gameState: 0,

        GAME_WIDTH: null,
        GAME_HEIGHT: null,
        GAME_WALL_SIZE: null,

        // Objets du jeu
        player: null,
        balls: [],
        bricks: [],
        invincibleBricks: [],
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
        maxArmorBrick: 0,
        ASSET_SIZE_MULTIPLE: 3,
        // background
        BACKGROUND_TYPE: 'background',
        // player
        PLAYER_TYPE: 'player',
        PLAYER_X: null,
        PLAYER_Y: null,
        PLAYER_WIDTH: null,
        PLAYER_HEIGHT: null,
        PLAYER_SPEED: 15,
        // ball
        BALL_TYPE: 'ball',
        BALL_X: null,
        BALL_Y: null,
        BALL_WIDTH: null,
        BALL_HEIGHT: null,
        BALL_SPEED: 20,
        // brick
        BRICK_TYPE: 'brick',
        BRICK_X_START: null,
        BRICK_Y_START: null,
        BRICK_WIDTH: null,
        BRICK_HEIGHT: null,
        BRICK_ARMOR_INVINCIBLE: 10,

        // Menu
        menuElements: [],
        MENU_TITLE_TYPE: 'titleMenu',
        MENU_TITLE_X: null,
        MENU_TITLE_Y: null,
        MENU_TITLE_WIDTH: null,
        MENU_TITLE_HEIGHT: null,
        MENU_START_TYPE: 'startMenu',
        MENU_START_X: null,
        MENU_START_Y: null,
        MENU_START_WIDTH: null,
        MENU_START_HEIGHT: null,


        // Méthodes
        init: function() {
            // Récupération du niveau en cours
            Model.map = LEVELS[Model.currentLevel];

            // Initialise certaines valeurs de base pour la génération des objets du jeu
            Model.initValues();

            Model.menuElements.push(new Asset(Model.MENU_TITLE_TYPE, Model.MENU_TITLE_X, Model.MENU_TITLE_Y, Model.MENU_TITLE_WIDTH, Model.MENU_TITLE_HEIGHT));
            Model.menuElements.push(new Asset(Model.MENU_START_TYPE, Model.MENU_START_X, Model.MENU_START_Y, Model.MENU_START_WIDTH, Model.MENU_START_HEIGHT));

            // Génération du background
            Model.background = new Asset(Model.BACKGROUND_TYPE, 0, 0, Model.GAME_WIDTH, Model.GAME_HEIGHT);
        },

        initValues: function() {
            // game
            Model.GAME_WIDTH = window.innerHeight*0.9;
            Model.GAME_HEIGHT = window.innerHeight*0.9;
            Model.GAME_WALL_SIZE = Model.GAME_WIDTH/30;
            Model.ASSET_SIZE_MULTIPLE = (Model.GAME_WIDTH/ASSETS[Model.BACKGROUND_TYPE].sWidth) * 1.51;

            // player
            Model.PLAYER_WIDTH = Math.round(ASSETS[Model.PLAYER_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE);
            Model.PLAYER_HEIGHT = Math.round(ASSETS[Model.PLAYER_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE);
            Model.PLAYER_X = Model.GAME_WIDTH/2 - (ASSETS[Model.PLAYER_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE) / 2;
            Model.PLAYER_Y = Model.GAME_HEIGHT - Model.GAME_HEIGHT*0.1;

            // ball
            Model.BALL_WIDTH = ASSETS[Model.BALL_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE;
            Model.BALL_HEIGHT = ASSETS[Model.BALL_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE;
            Model.BALL_X = Model.GAME_WIDTH/2 - (ASSETS[Model.BALL_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE) / 2;
            Model.BALL_Y = Model.PLAYER_Y - Model.BALL_HEIGHT;

            // brick
            Model.BRICK_WIDTH = Math.round(ASSETS[Model.BRICK_TYPE].sWidth*Model.ASSET_SIZE_MULTIPLE);
            Model.BRICK_HEIGHT = Math.round(ASSETS[Model.BRICK_TYPE].sHeight*Model.ASSET_SIZE_MULTIPLE);
            Model.BRICK_X_START = Model.GAME_WIDTH/2 - (Model.map[0].length*Model.BRICK_WIDTH)/2;
            Model.BRICK_Y_START = Model.GAME_HEIGHT*0.2;

            // menu
            Model.MENU_TITLE_WIDTH = Model.GAME_WIDTH/1.5;
            Model.MENU_TITLE_HEIGHT = ASSETS[Model.MENU_TITLE_TYPE].sHeight/ASSETS[Model.MENU_TITLE_TYPE].sWidth * Model.GAME_WIDTH/1.5;
            Model.MENU_TITLE_X = Model.GAME_WIDTH/2 - Model.MENU_TITLE_WIDTH/2;
            Model.MENU_TITLE_Y = Model.GAME_HEIGHT / 3;

            Model.MENU_START_WIDTH = ASSETS[Model.MENU_START_TYPE].sWidth;
            Model.MENU_START_HEIGHT = ASSETS[Model.MENU_START_TYPE].sHeight;
            Model.MENU_START_X = Model.GAME_WIDTH/2 - Model.MENU_START_WIDTH/2;
            Model.MENU_START_Y = Model.MENU_TITLE_Y + Model.GAME_HEIGHT/3;
        },

        playSound: function(source) {
            if(Model.soundMuted) {
                return;
            }

            var sound = new Audio(source);
            sound.play();
            sound.addEventListener('ended', function (ev) {
                Model.sounds.splice(Model.sounds.indexOf(sound), 1);
            });
            Model.sounds.push(sound);
        },

        resizeMap: function() {
            Model.BRICK_X_START = Model.GAME_WIDTH/2 - (Model.map[0].length*Model.BRICK_WIDTH)/2;
        },

        generateLevel: function() {
            Model.balls = [];
            Model.bricks = [];

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
            Model.maxArmorBrick = Math.max(...Model.map.map( (row) => {
                return Math.max(...row);
            }));
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
                            (Math.random() < Model.POWERUP_PROBABILITY) ? Model.choosePowerup() : null
                        ));
                    }
                }
            }
        },

        choosePowerup: function() {
            if(Math.random() < Model.BONUS_PROBABILITY) {
                let rand = Math.random();
                for(const bonusName in Model.BONUS_DATA) {
                    if(rand < Model.BONUS_DATA[bonusName].prob) {
                        return bonusInfos.;
                    }
                }
            }
            else {

            }
        },

        generateBall: function(x, y) {
            Model.balls.push(new Ball(
                Model.BALL_TYPE,
                x,
                y,
                Model.BALL_WIDTH,
                Model.BALL_HEIGHT,
                Model.BALL_SPEED
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
                if(Model.currentLevel+1 >= LEVELS.length) {
                    Model.gameState = Model.OVER;
                }
                else {
                    Model.changeLevel(Model.currentLevel+1);
                }
            }
        },

        ballAndCanvasCollision: function(ball) {
            // right and left
            if(ball.x+ball.velocityX > Model.GAME_WIDTH-ball.width-Model.GAME_WALL_SIZE || ball.x+ball.velocityX < Model.GAME_WALL_SIZE) {
                ball.velocityX = -ball.velocityX;
                return true;
            }

            // top
            if(ball.y+ball.velocityY < Model.GAME_WALL_SIZE) {
                ball.velocityY = -ball.velocityY;
                return true;
            }
            // bottom
            else if (ball.y+ball.velocityY > Model.GAME_HEIGHT-ball.height) {
                Controller.ballTouchBottom(ball);
                return true;
            }
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
                else {
                    Model.handleCollisionForBall(collisionSide, ball);
                }

                Model.playSound(Model.SOUND_PLAYER_COLLISION);
            }
        },

        calcNewVelocityforBall: function(ball) {
            ball.velocityX = Math.min(Math.max((((ball.x+ball.width/2)-Model.player.x) / Model.player.width)*2 - 1, -0.6), 0.6);
            ball.velocityY = -(1-Math.abs(ball.velocityX));
        },

        ballAndBricksCollision: function(ball) {
            for (let i=0; i<Model.bricks.length; i++) {
                let collisionSide = Model.getCollisionSide(Model.bricks[i], ball);
                if(collisionSide !== false) {
                    Model.handleCollisionForBall(collisionSide, ball);

                    if(Model.bricks[i].armor !== Model.BRICK_ARMOR_INVINCIBLE) {
                        Model.bricks[i].loseArmor();
                    }

                    if(Model.bricks[i].armor <= 0) {
                        if(Model.bricks[i].powerup !== null) {
                            Model.generatePowerup(Model.bricks[i].powerup);
                        }
                        Model.bricks.splice(i, 1);
                        Model.playSound(Model.SOUND_DESTROY_BRICK);
                    }
                    else {
                        Model.playSound(Model.SOUND_ARMOR_COLLISION);
                    }

                    return true;
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
                    ball.move();

                    if(Model.testBallCollisions(ball)) {
                        break;
                    }
                }
            });
        },

        updatePlayerPosition: function() {
            let oldPosition = Model.player.x;
            if(Model.controls.left && !Model.controls.right && Model.player.x > Model.GAME_WALL_SIZE) {
                Model.player.move(-1);
            } else if(!Model.controls.left && Model.controls.right && Model.player.x < (this.GAME_WIDTH-Model.player.width-Model.GAME_WALL_SIZE)) {
                Model.player.move(1);
            }

            // Si la balle n'est pas encore lancée, elle suit le joueur
            if(Model.gameState === Model.READY && Model.balls !== []) {
                Model.balls[0].x += Model.player.x-oldPosition;
            }
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
                        return ((vy>0) ? Model.COLLISION_TOP : Model.COLLISION_BOTTOM);
                    }
                    else {
                        return ((vx>0) ? Model.COLLISION_LEFT : Model.COLLISION_RIGHT);
                    }
                }
            }
            
            return false;
        },

        destroyBall: function (ball) {
            Model.balls.splice(Model.balls.indexOf(ball), 1);
        }
    };





    var Controller = {
        // Propriétés
        previousDelta: 0,



        // Méthodes
        gameLoop: function(currentDelta) {
            // Contrôle l'appel de la fonction par rapport aux FPS
            Model.gameAnimationFrame = window.requestAnimationFrame(Controller.gameLoop);
		    var delta = currentDelta - Controller.previousDelta;
            if (Model.FPS && delta < 1000 / Model.FPS) {
                return;
            }

            // Boucle du jeu
            switch (Model.gameState) {
                case Model.INIT:
                    Model.init();
                    View.init();
                    View.bindEvents();
                    View.setLives(Model.lives);
                    Model.generateLevel();
                    Model.gameState = Model.LOADING;
                    break;
                case Model.MENU:
                    Controller.renderMenu();
                    Model.gameState = Model.MENU_READY;
                    break;
                case Model.MENU_READY:
                    if(Model.controls.space === true) {
                        Model.gameState = Model.READY;
                        Model.controls.space = false;
                        return;
                    }
                    break;
                case Model.READY:
                    if(Model.controls.space === true) {
                        Model.gameState = Model.PLAYING;
                        Model.controls.space = false;
                        return;
                    }
                    Model.updatePlayerPosition();
                    Controller.render();
                    break;
                case Model.PLAYING:
                    Model.updatePlayerPosition();
                    Model.updateBalls();
                    Model.checkLevelCompleted();
                    Controller.render();
                    break;
                case Model.OVER:
                    alert('La partie est terminée');
                    cancelAnimationFrame(Model.gameAnimationFrame);
                    break;
            }

            Controller.previousDelta = currentDelta;
        },

        ballTouchBottom: function(ball) {
            Model.destroyBall(ball);

            if(Model.balls.length >= 1) { return; }

            // If it was the last ball ont the screen, the player lose a life
            Model.lives--;
            View.setLives(Model.lives);

            if(Model.lives === 0) {
                Model.gameState = Model.OVER;
                return;
            }

            Model.gameState = Model.READY;
            Model.generateBall(Model.player.x+Model.player.width/2-ball.width/2, Model.BALL_Y);
        },

        renderMenu: function() {
            // On efface le canvas
            View.clearView();

            // Rendu de l'arrière-plan
            View.drawImage(Model.background);

            Model.menuElements.forEach(View.drawImage);
        },

        render: function() {
            // On efface le canvas
            View.clearView();

            // Rendu de l'arrière-plan
            View.drawImage(Model.background);

            // Rendu du joueur
            View.drawImage(Model.player);

            Model.balls.forEach(View.drawImage);

            Model.bricks.forEach(View.drawImage);
        },

        assetsLoaded: function() {
            Model.gameState = Model.MENU;
        },


        // Handlers
        handler_keydown: function(event) {
            switch(event.key) {
                case "ArrowLeft":
                    Model.controls.left = true;
                    break;

                case "ArrowRight":
                    Model.controls.right = true;
                    break;
                
                case " ":
                    Model.controls.space = true;
                    break;
            }
        },

        handler_keyup: function(event) {
            switch(event.key) {
                case "ArrowLeft":
                    Model.controls.left = false;
                    break;

                case "ArrowRight":
                    Model.controls.right = false;
                    break;
                
                case " ":
                    Model.controls.space = false;
                    break;
            }
        },



        // Getters
        getGameSize: function() {
            return {
                WIDTH: Model.GAME_WIDTH,
                HEIGHT: Model.GAME_HEIGHT
            };
        }
    };






    var View = {
        // Propriétés
        canvas: null,
        context: null,

        assets: null,

        livesNode: null,




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
            View.livesNode = document.querySelector('#lives');
        },

        bindEvents: function() {
            window.addEventListener('keydown', Controller.handler_keydown);
            window.addEventListener('keyup', Controller.handler_keyup);
        },

        setLives: function(lives) {
            View.livesNode.textContent = lives;
        },

        clearView: function() {
            View.context.clearRect(0, 0, View.canvas.width, View.canvas.height);
        },

        drawImage: function(obj) {
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
        },
    };

//     return {
//         start: function() {
            Controller.gameLoop();
//         }
//     };
// })();




// Game.start();