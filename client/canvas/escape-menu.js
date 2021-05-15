const characters = require('../characters');
const $ = require('jquery');

module.exports = class EscapeMenu {
    constructor(clientState, escapeMenuDiv, game) {
        this.clientState = clientState;
        this.escapeMenuDiv = escapeMenuDiv;
        this.game = game;
        this.selections = {};

        Object.keys(characters).forEach((c) => {
            const characterSelect = $(`<div>
                <img src="resources/${characters[c].resources.base}" />
            </div>`);
            if (c === 'Marine') {
                characterSelect.addClass('selected');
            }
            $('.characterSelect').append(characterSelect);
            characterSelect.click(() => {
                clientState.SendCharacterSelection(c);
            });
            this.selections[c] = characterSelect;
        });

        $(".backToGameBtn").click(() => {
            this.game.canvas.requestPointerLock();
        });

        escapeMenuDiv.style.display = "none";
        setInterval(() => {
            escapeMenuDiv.style.display = clientState.isPaused ? "block" : "none";
        }, 100);

        clientState.RegisterEvent('char-selected', (obj) => {
            console.log("CharSelected", obj);
            Object.values(this.selections).forEach(o => {
                o.removeClass('selected');
            });
            this.selections[obj['char-selected']].addClass('selected');
        });
    }
};