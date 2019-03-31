
import Vue from "vue";

import { IProjectCard } from "../cards/IProjectCard";
import { ICard } from "../cards/ICard";
import { BeginnerCorporation } from "../cards/corporation/BeginnerCorporation";
import { ALL_CORPORATION_CARDS, ALL_PROJECT_CARDS } from "../Dealer";
import { Tags } from "../cards/Tags";
import { CardType } from "../cards/CardType";

function getCorporationCardByName(cardName: string): ICard | undefined {
    if (cardName === (new BeginnerCorporation()).name) {
        return new BeginnerCorporation();
    }
    return ALL_CORPORATION_CARDS.find((card) => card.name === cardName);
}

function getProjectCardByName(cardName: string): IProjectCard | undefined {
    return ALL_PROJECT_CARDS.find((card) => card.name === cardName);
}

function getCardAsString(cardName: string): string {
    interface Card {
        cost?: number;
        startingMegaCredits?: number;
        name: string;
        tags: Array<Tags>;
        text: string;
        cardType?: CardType;
        description: string;
        actionText?: string;
    }
    let card: Card | undefined = getProjectCardByName(cardName) || getCorporationCardByName(cardName);
    if (card === undefined) {
        throw new Error("Card not found");
    }
    let out = "<span";
    if (card.cardType === CardType.EVENT) {
        out += " style='font-weight:bold;color:red'";
    } else if (card.cardType === CardType.ACTIVE) {
        out += " style='font-weight:bold;color:blue'";
    } else if (card.cardType === CardType.AUTOMATED) {
        out += " style='font-weight:bold;color:green'";
    } else {
        out += " style='font-weight:bold'";
    }
    out += ">" + cardName + "</span>";
    if (card === undefined) {
        throw new Error("Did not find card");
    }
    if (card.cost !== undefined) {
        out += " Costs " + String(card.cost) + ".";
    }
    if (card.startingMegaCredits !== undefined) {
        out += " Start with " + String(card.startingMegaCredits) + " mega credits.";
    }
    if (card.tags.length === 1) {
        out += " Has " + card.tags[0] + " tag.";
    } else if (card.tags.length > 1) {
        out += " Has ";
        let i = 0;
        for (; i < card.tags.length - 1; i++) {
            out += card.tags[i] + ", ";
        }
        out += "and " + card.tags[i] + " tags.";
    }
    if (card.actionText) {
        out += " <b>" + card.actionText + "</b>";
    }
    out += " " + card.text;
    out += " <i>" + card.description + "</i>";
    return out;
}

export const Card = Vue.component("card", {
    props: ["card"],
    data: function () {
        return {};
    },
    render: function (createElement) {
        return createElement("span", { domProps: { innerHTML: getCardAsString(this.card) } });
    }
});
