const characters = require('../characters');
const $ = require('jquery');

const Cookies = require('js-cookie');


module.exports = class EscapeMenu {
    constructor(clientState, escapeMenuDiv, game) {
        this.BindSliderAndTextbox($("#sensitivitySlider"), $("#sensitivityTextbox"));

        this.clientState = clientState;
        this.escapeMenuDiv = escapeMenuDiv;
        this.game = game;
        this.selections = {};

        this.playerSettings = Cookies.get('playerSettings');
        if (this.playerSettings === undefined) {
            // setup cookie initially
            this.playerSettings = clientState.GetDefaultPlayerSettings();
            Cookies.set('playerSettings', this.playerSettings);
        }
        else {
            this.playerSettings = JSON.parse(this.playerSettings);
        }
        this.UpdateUIToMatchPlayerSettings();

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
            escapeMenuDiv.style.display = clientState.showInventory ? "block" : "none";
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
        $(".primary .swapBtn").on("click", () => {
            this.clientState.SwapPrimaryAndSecondary();
        });
        $(".secondary .swapBtn").on("click", () => {
            this.clientState.SwapPrimaryAndSecondary();
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
        $("#applySettings").on("click", () => {
            this.ApplyPlayerSettings();
        });

        const firstSettings = setInterval(() => {
            if (this.clientState.GetPlayerObject()) {
                this.ApplyPlayerSettings();
                clearInterval(firstSettings);
            }
        }, 100);
    }

    ApplyPlayerSettings() {
        this.playerSettings['sensitivity'] = parseFloat($("#sensitivityTextbox").val());
        Cookies.set('playerSettings', this.playerSettings);
        this.clientState.ApplyPlayerSettings(this.playerSettings);
    }

    UpdateUIToMatchPlayerSettings() {
        $("#sensitivityTextbox").val(this.playerSettings.sensitivity);
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

        $(".primary   .slotContent").html(primary   ? primary.name   : "&nbsp;");
        $(".secondary .slotContent").html(secondary ? secondary.name : "&nbsp;");
        $(".slot0     .slotContent").html(slot0     ? slot0.name     : "&nbsp;");
        $(".slot1     .slotContent").html(slot1     ? slot1.name     : "&nbsp;");
        $(".slot2     .slotContent").html(slot2     ? slot2.name     : "&nbsp;");
        $(".slot3     .slotContent").html(slot3     ? slot3.name     : "&nbsp;");
        $(".slot4     .slotContent").html(slot4     ? slot4.name     : "&nbsp;");
        $(".slot5     .slotContent").html(slot5     ? slot5.name     : "&nbsp;");

        $(".primary   .slotImage").attr('src', "resources/weapons/" + (primary   ? primary.logo   : "BlankWide.png"));
        $(".secondary .slotImage").attr('src', "resources/weapons/" + (secondary ? secondary.logo : "BlankWide.png"));
        $(".slot0     .slotImage").attr('src', "resources/weapons/" + (slot0     ? slot0.logo     : "BlankNarrow.png"));
        $(".slot1     .slotImage").attr('src', "resources/weapons/" + (slot1     ? slot1.logo     : "BlankNarrow.png"));
        $(".slot2     .slotImage").attr('src', "resources/weapons/" + (slot2     ? slot2.logo     : "BlankNarrow.png"));
        $(".slot3     .slotImage").attr('src', "resources/weapons/" + (slot3     ? slot3.logo     : "BlankNarrow.png"));
        $(".slot4     .slotImage").attr('src', "resources/weapons/" + (slot4     ? slot4.logo     : "BlankNarrow.png"));
        $(".slot5     .slotImage").attr('src', "resources/weapons/" + (slot5     ? slot5.logo     : "BlankNarrow.png"));
    }

    BindSliderAndTextbox(slider, textbox) {
        slider.on('input', () => {
            textbox.val(slider.val());
        });
        textbox.on('input', () => {
            slider.val(textbox.val());
        });
    }
};