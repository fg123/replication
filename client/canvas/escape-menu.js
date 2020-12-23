const characters = require('../characters');
const $ = require('jquery');

module.exports = class EscapeMenu {
    constructor(clientState, escapeMenuDiv) {
        this.clientState = clientState;
        this.escapeMenuDiv = escapeMenuDiv;

        Object.keys(characters).forEach((c) => {
            const characterSelect = $(`<div>
                <img src="resources/${characters[c].resources.base}" />
            </div>`);
            $('.characterSelect').append(characterSelect);
            characterSelect.click(() => {
                clientState.SendCharacterSelection(c);
            });
        });

        escapeMenuDiv.style.display = "none";
        setInterval(() => {
            escapeMenuDiv.style.display = clientState.isPaused ? "block" : "none";
        }, 100);
    }
};