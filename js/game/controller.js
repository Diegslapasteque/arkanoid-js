var Controller = {
    // Propriétés



    // Méthodes
    gameLoop: function() {
        // Contrôle l'appel de la fonction par rapport aux FPS
        Model.gameAnimationFrame = window.requestAnimationFrame(Controller.gameLoop);
        if(Model.canPlayGameloop() === false) { return; }


        // Boucle du jeu
        switch (Model.gameState) {
            case Model.INIT:
                Model.init();
                View.init();
                View.bindEvents();
                View.setLives(Model.lives);
                Model.generateLevel();
                setInterval(function () {
                    // console.log(Model.currentFPS);
                    Model.currentFPS = 0;
                }, 1000);
                Model.gameState = Model.LOADING;
                break;
            case Model.MENU:
                Controller.renderMenu();
                Model.gameState = Model.MENU_READY;
                break;
            case Model.MENU_READY:
                if (Model.controls.space === true) {
                    Model.playSound('BACKGROUND_MUSIC');
                    View.hideText();
                    Model.gameState = Model.READY;
                    Model.controls.space = false;
                    return;
                }
                break;
            case Model.READY:
                if (Model.controls.space === true) {
                    Model.gameState = Model.PLAYING;
                    Model.controls.space = false;
                    return;
                }
                Model.updatePlayerPosition();
                Controller.render();
                break;
            case Model.PLAYING:
                Model.timeSoundBefore += Model.frameDuration;
                Model.updateBalls();
                Model.updatePlayerPosition();
                Model.updatePowerups();
                Model.updateMissiles();
                Controller.render();
                Controller.updatePowerupsInfos();
                break;
            case Model.END:
                cancelAnimationFrame(Model.gameAnimationFrame);
                Controller.emptyGame();
                Model.stopSound('BACKGROUND_MUSIC');
                if(Model.lives === 0) {
                    View.showText(View.deathText);
                }
                else {
                    View.showText(View.endText);
                }
                break;
        }

        Model.currentFPS++;
    },

    restartGame: function() {
        View.hideText();
        Model.gameState = Model.INIT;
        Controller.gameLoop();
    },

    emptyGame: function() {
        Model.emptyGame();
        View.emptyGame();
    },

    playerGetPowerup: function(powerup) {
        if(powerup.activationTime !== 0) {
            View.drawPowerupInfos(powerup);
        }
    },

    levelGenerated: function() {
        View.deletePowerupsInfos();
    },

    ballTouchBottom: function(ball) {
        Model.destroyBall(ball);

        if(Model.balls.length >= 1) { return; }

        Controller.loseLife();
    },

    increaseLife: function() {
        Model.lives++;
        View.setLives(Model.lives);
    },

    loseLife: function() {
        // If it was the last ball on the screen, the player lose a life

        Model.playSound('SOUND_PLAYER_DEATH');

        Model.activePowerups.forEach((powerup) => {
            powerup.desactivate();
        });
        Model.activePowerups = [];
        Model.powerups = [];
        Model.missiles = [];
        View.deletePowerupsInfos();

        if(Model.lives === 0) {
            Model.gameState = Model.END;
            return;
        }
        Model.lives--;
        View.setLives(Model.lives);

        Model.gameState = Model.READY;

        Model.balls = [];
        Model.generateBall(Model.player.x+Model.player.width/2-Model.BALL_WIDTH/2, Model.BALL_Y);
    },

    updatePowerupsInfos: function() {
        Model.activePowerups.forEach(View.updatePowerupInfos);
    },

    powerupDesactivated: function(powerup) {
        View.removePowerupInfos(powerup);
    },

    renderMenu: function() {
        // On efface le canvas
        View.clearView();

        // Rendu de l'arrière-plan
        View.drawImage(Model.background);

        View.showText(View.menuText);
    },

    render: function() {
        // On efface le canvas
        View.clearView();

        // Rendu de l'arrière-plan
        View.drawImage(Model.background);

        Model.balls.forEach(View.drawImage);

        Model.bricks.forEach(View.drawImage);

        Model.powerups.forEach(View.drawImage);

        Model.missiles.forEach(View.drawImage);

        // Rendu du joueur
        View.drawImage(Model.player);

        if(Model.player !== null && Model.player.canShoot === true) {
            View.drawImage(Model.canon);
        }
    },

    assetsLoaded: function() {
        Model.assetsLoaded++;
        if(Model.assetsLoaded === Model.assetsToLoad) {
            Model.gameState = Model.MENU;
        }
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
                if(Model.gameState === Model.END) {
                    Controller.restartGame();
                }
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
