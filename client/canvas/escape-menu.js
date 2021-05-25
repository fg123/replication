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
            this.DrawInventory();
        }, 100);

        clientState.RegisterEvent('char-selected', (obj) => {
            console.log("CharSelected", obj);
            Object.values(this.selections).forEach(o => {
                o.removeClass('selected');
            });
            this.selections[obj['char-selected']].addClass('selected');
        });
        $(".primary .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(0);
        });
        $(".secondary .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(1);
        });
        $(".slot0 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(2);
        });
        $(".slot1 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(3);
        });
        $(".slot2 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(4);
        });
        $(".slot3 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(5);
        });
        $(".slot4 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(6);
        });
        $(".slot5 .dropBtn").on("click", () => {
            this.clientState.InventoryDrop(7);
        });
    }

    DrawInventory() {
        const player = this.clientState.GetPlayerObject();
        if (!player) return;
        if (!player.im) return;
        // console.log(player.im);
        const primary = this.clientState.GetObject(player.im.p);
        const secondary = this.clientState.GetObject(player.im.s);
        const slot0 = this.clientState.GetObject(player.im.o[0]);
        const slot1 = this.clientState.GetObject(player.im.o[1]);
        const slot2 = this.clientState.GetObject(player.im.o[2]);
        const slot3 = this.clientState.GetObject(player.im.o[3]);
        const slot4 = this.clientState.GetObject(player.im.o[4]);
        const slot5 = this.clientState.GetObject(player.im.o[5]);

        $(".primary div").html(primary ? primary.name : "");
        $(".secondary div").html(secondary ? secondary.name : "");
        $(".slot0 div").html(slot0 ? slot0.name : "");
        $(".slot1 div").html(slot1 ? slot1.name : "");
        $(".slot2 div").html(slot2 ? slot2.name : "");
        $(".slot3 div").html(slot3 ? slot3.name : "");
        $(".slot4 div").html(slot4 ? slot4.name : "");
        $(".slot5 div").html(slot5 ? slot5.name : "");
    }
};