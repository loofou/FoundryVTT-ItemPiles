import * as Helpers from "../helpers/helpers.js";
import * as Utilities from "../helpers/utilities.js";
import * as PileUtilities from "../helpers/pile-utilities.js";
import * as SharingUtilities from "../helpers/sharing-utilities.js";
import SETTINGS from "../constants/settings.js";
import ItemPileSocket from "../socket.js";
import HOOKS from "../constants/hooks.js";
import TradeAPI from "./trade-api.js";
import PrivateAPI from "./private-api.js";

class API {
  /**
   * @class API
   */

  /**
   * The actor class type used for the original item pile actor in this system
   *
   * @returns {string}
   */
  static get ACTOR_CLASS_TYPE() {
    return Helpers.getSetting(SETTINGS.ACTOR_CLASS_TYPE);
  }

  /**
   * The currencies used in this system
   *
   * @returns {Array<{primary: boolean, name: string, data: Object, img: string, abbreviation: string, exchange: number}>}
   */
  static get CURRENCIES() {
    return Helpers.getSetting(SETTINGS.CURRENCIES);
  }

  /**
   * The attribute used to track the price of items in this system
   *
   * @returns {string}
   */
  static get ITEM_PRICE_ATTRIBUTE() {
    return Helpers.getSetting(SETTINGS.ITEM_PRICE_ATTRIBUTE);
  }

  /**
   * The attribute used to track the quantity of items in this system
   *
   * @returns {string}
   */
  static get ITEM_QUANTITY_ATTRIBUTE() {
    return Helpers.getSetting(SETTINGS.ITEM_QUANTITY_ATTRIBUTE);
  }

  /**
   * The filters for item types eligible for interaction within this system
   *
   * @returns {Array<{name: string, filters: string}>}
   */
  static get ITEM_FILTERS() {
    return Helpers.getSetting(SETTINGS.ITEM_FILTERS);
  }

  /**
   * The attributes for detecting item similarities
   *
   * @returns {Array<string>}
   */
  static get ITEM_SIMILARITIES() {
    return Helpers.getSetting(SETTINGS.ITEM_SIMILARITIES);
  }

  /**
   * Sets the actor class type used for the original item pile actor in this system
   *
   * @param {string} inClassType
   * @returns {Promise}
   */
  static async setActorClassType(inClassType) {
    if (typeof inClassType !== "string") {
      throw Helpers.custom_error("setActorTypeClass | inClassType must be of type string");
    }
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.ACTOR_CLASS_TYPE, inClassType);
      resolve();
    });
  }

  /**
   * Sets the currencies used in this system
   *
   * @param {Array<Object>} inCurrencies
   * @returns {Promise}
   */
  static async setCurrencies(inCurrencies) {
    if (!Array.isArray(inCurrencies)) {
      throw Helpers.custom_error("setCurrencies | inCurrencies must be an array");
    }
    inCurrencies.forEach(currency => {
      if (typeof currency !== "object") {
        throw Helpers.custom_error("setCurrencies | each entry in inCurrencies must be of type object");
      }
      if (typeof currency.primary !== "boolean") {
        throw Helpers.custom_error("setCurrencies | currency.primary must be of type boolean");
      }
      if (typeof currency.name !== "string") {
        throw Helpers.custom_error("setCurrencies | currency.name must be of type string");
      }
      if (typeof currency.abbreviation !== "string") {
        throw Helpers.custom_error("setCurrencies | currency.abbreviation must be of type string");
      }
      if (typeof currency.exchange !== "number") {
        throw Helpers.custom_error("setCurrencies | currency.exchange must be of type number");
      }
      if (typeof currency.data !== "object") {
        throw Helpers.custom_error("setCurrencies | currency.data must be of type object");
      }
      if (typeof currency.data.path !== "string" || typeof currency.data.uuid !== "string" || typeof currency.data.item !== "object") {
        throw Helpers.custom_error("setCurrencies | currency.data must contain either \"path\" (string), \"uuid\" (string), or \"item\" (object)");
      }
      if (currency.img && typeof currency.img !== "string") {
        throw Helpers.custom_error("setCurrencies | currency.img must be of type string");
      }
    });
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.CURRENCIES, inCurrencies);
      resolve();
    });
  }

  /**
   * Sets the attribute used to track the quantity of items in this system
   *
   * @param {string} inAttribute
   * @returns {Promise}
   */
  static async setItemQuantityAttribute(inAttribute) {
    if (typeof inAttribute !== "string") {
      throw Helpers.custom_error("setItemQuantityAttribute | inAttribute must be of type string");
    }
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.ITEM_QUANTITY_ATTRIBUTE, inAttribute);
      resolve();
    });
  }

  /**
   * Sets the attribute used to track the price of items in this system
   *
   * @param {string} inAttribute
   * @returns {Promise}
   */
  static async setItemPriceAttribute(inAttribute) {
    if (typeof inAttribute !== "string") {
      throw Helpers.custom_error("setItemPriceAttribute | inAttribute must be of type string");
    }
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.ITEM_PRICE_ATTRIBUTE, inAttribute);
      resolve();
    });
  }

  /**
   * Sets the items filters for interaction within this system
   *
   * @param {Array<{path: string, filters: string}>} inFilters
   * @returns {Promise}
   */
  static async setItemFilters(inFilters) {
    if (!Array.isArray(inFilters)) {
      throw Helpers.custom_error("setItemFilters | inFilters must be of type array");
    }
    inFilters.forEach(filter => {
      if (typeof filter?.path !== "string") {
        throw Helpers.custom_error("setItemFilters | each entry in inFilters must have a \"path\" property with a value that is of type string");
      }
      if (typeof filter?.filters !== "string") {
        throw Helpers.custom_error("setItemFilters | each entry in inFilters must have a \"filters\" property with a value that is of type string");
      }
    });
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.ITEM_FILTERS, inFilters);
      resolve();
    });
  }

  /**
   * Sets the attributes for detecting item similarities
   *
   * @param {Array<string>} inPaths
   * @returns {Promise}
   */
  static async setItemSimilarities(inPaths) {
    if (!Array.isArray(inPaths)) {
      throw Helpers.custom_error("setItemSimilarities | inPaths must be of type array");
    }
    inPaths.forEach(path => {
      if (typeof path !== "string") {
        throw Helpers.custom_error("setItemSimilarities | each entry in inPaths must be of type string");
      }
    });
    return new Promise(async (resolve) => {
      await Helpers.setSetting(SETTINGS.PRECONFIGURED_SYSTEM, true);
      await Helpers.setSetting(SETTINGS.ITEM_SIMILARITIES, inPaths);
      resolve();
    });
  }

  static async getPrimaryCurrency(actor = false) {
    if (actor && actor instanceof Actor) {
      return PileUtilities.getActorPrimaryCurrency(actor);
    }
    return this.CURRENCIES.find(currency => currency.primary);
  }

  /* ================= ITEM PILE METHODS ================= */

  /**
   * Creates the default item pile token at a location.
   *
   * @param {object} position                               The position to create the item pile at
   * @param {object} options                                Options to pass to the function
   * @param {string/boolean} [options.sceneId=false]        Which scene to create the item pile on
   * @param {Array/boolean} [options.items=false]           Any items to create on the item pile
   * @param {string/boolean} [options.pileActorName=false]  Whether to use an existing item pile actor as the basis of this new token
   *
   * @returns {Promise<string>}
   */
  static createItemPile(position, {
    sceneId = game.user.viewedScene, items = false, pileActorName = false
  } = {}) {

    if (pileActorName) {
      const pileActor = game.actors.getName(pileActorName);
      if (!pileActor) {
        throw Helpers.custom_error(`There is no actor of the name "${pileActorName}"`, true);
      } else if (!PileUtilities.isValidItemPile(pileActor)) {
        throw Helpers.custom_error(`The actor of name "${pileActorName}" is not a valid item pile actor.`, true);
      }
    }

    if (items) {
      items = items.map(item => {
        return item instanceof Item ? item.toObject() : item;
      })
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.CREATE_PILE, sceneId, position, { pileActorName, items });
  }

  /**
   * Turns tokens and its actors into item piles
   *
   * @param {Token/TokenDocument/Array<Token/TokenDocument>} targets  The targets to be turned into item piles
   * @param {object} options                                          Options to pass to the function
   * @param {object} options.pileSettings                             Overriding settings to be put on the item piles' settings
   * @param {object} options.tokenSettings                            Overriding settings that will update the tokens' settings
   *
   * @return {Promise<Array>}                                         The uuids of the targets after they were turned into item piles
   */
  static turnTokensIntoItemPiles(targets, { pileSettings = {}, tokenSettings = {} } = {}) {

    if (!Array.isArray(targets)) targets = [targets];

    const targetUuids = targets.map(target => {
      if (!(target instanceof Token || target instanceof TokenDocument)) {
        throw Helpers.custom_error(`turnTokensIntoItemPiles | Target must be of type Token or TokenDocument`, true)
      }
      const targetUuid = Utilities.getUuid(target);
      if (!targetUuid) throw Helpers.custom_error(`turnTokensIntoItemPiles | Could not determine the UUID, please provide a valid target`, true)
      return targetUuid;
    })

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TURN_INTO_PILE, targetUuids, pileSettings, tokenSettings);
  }

  /**
   * Reverts tokens from an item pile into a normal token and actor
   *
   * @param {Token/TokenDocument/Array<Token/TokenDocument>} targets  The targets to be reverted from item piles
   * @param {object} options                                          Options to pass to the function
   * @param {object} options.tokenSettings                            Overriding settings that will update the tokens
   *
   * @return {Promise<Array>}                                         The uuids of the targets after they were reverted from being item piles
   */
  static revertTokensFromItemPiles(targets, { tokenSettings = {} } = {}) {

    if (!Array.isArray(targets)) targets = [targets];

    const targetUuids = targets.map(target => {
      if (!(target instanceof Token || target instanceof TokenDocument)) {
        throw Helpers.custom_error(`revertTokensFromItemPiles | Target must be of type Token or TokenDocument`, true)
      }
      const targetUuid = Utilities.getUuid(target);
      if (!targetUuid) throw Helpers.custom_error(`revertTokensFromItemPiles | Could not determine the UUID, please provide a valid target`, true)
      return targetUuid;
    })

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.REVERT_FROM_PILE, targetUuids, tokenSettings);
  }

  /**
   * Opens a pile if it is enabled and a container
   *
   * @param {Token/TokenDocument} target
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static openItemPile(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;
    const wasLocked = pileData.locked;
    const wasClosed = pileData.closed;
    pileData.closed = false;
    pileData.locked = false;
    if (wasLocked) {
      const hookResult = Helpers.hooks.call(HOOKS.PILE.PRE_UNLOCK, targetActor, pileData, interactingTokenDocument);
      if (hookResult === false) return false;
    }
    const hookResult = Helpers.hooks.call(HOOKS.PILE.PRE_OPEN, targetActor, pileData, interactingTokenDocument);
    if (hookResult === false) return false;
    if (wasClosed && pileData.openSound) {
      let sound = pileData.openSound;
      if (pileData.openSound.includes("*")) {
        sound = Helpers.random_array_element(pileData.openSounds)
      }
      AudioHelper.play({ src: sound }, true)
    }
    return this.updateItemPile(targetActor, pileData, { interactingToken: interactingTokenDocument });
  }

  /**
   * Closes a pile if it is enabled and a container
   *
   * @param {Token/TokenDocument} target          Target pile to close
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static closeItemPile(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;

    const wasOpen = !pileData.closed;
    pileData.closed = true;

    const hookResult = Helpers.hooks.call(HOOKS.PILE.PRE_CLOSE, targetActor, pileData, interactingTokenDocument);
    if (hookResult === false) return false;

    if (wasOpen && pileData.closeSound) {
      let sound = pileData.closeSound;
      if (pileData.closeSound.includes("*")) {
        sound = Helpers.random_array_element(pileData.closeSounds)
      }
      AudioHelper.play({ src: sound }, true)
    }

    return this.updateItemPile(targetActor, pileData, { interactingToken: interactingTokenDocument });
  }

  /**
   * Toggles a pile's closed state if it is enabled and a container
   *
   * @param {Token/TokenDocument} target          Target pile to open or close
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static async toggleItemPileClosed(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;
    if (pileData.closed) {
      await this.openItemPile(targetActor, interactingTokenDocument);
    } else {
      await this.closeItemPile(targetActor, interactingTokenDocument);
    }
    return !pileData.closed;
  }

  /**
   * Locks a pile if it is enabled and a container
   *
   * @param {Token/TokenDocument} target          Target pile to lock
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static lockItemPile(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;
    const wasClosed = pileData.closed;
    pileData.closed = true;
    pileData.locked = true;
    if (!wasClosed) {
      const hookResult = Helpers.hooks.call(HOOKS.PILE.PRE_CLOSE, targetActor, pileData, interactingTokenDocument);
      if (hookResult === false) return false;
    }
    const hookResult = Helpers.hooks.call(HOOKS.PILE.PRE_LOCK, targetActor, pileData, interactingTokenDocument);
    if (hookResult === false) return false;
    if (!wasClosed && pileData.closeSound) {
      let sound = pileData.closeSound;
      if (pileData.closeSound.includes("*")) {
        sound = Helpers.random_array_element(pileData.closeSounds)
      }
      AudioHelper.play({ src: sound }, true)
    }
    return this.updateItemPile(targetActor, pileData, { interactingToken: interactingTokenDocument });
  }

  /**
   * Unlocks a pile if it is enabled and a container
   *
   * @param {Token/TokenDocument} target          Target pile to unlock
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static unlockItemPile(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;
    pileData.locked = false;
    Helpers.hooks.call(HOOKS.PILE.PRE_UNLOCK, targetActor, pileData, interactingTokenDocument);
    return this.updateItemPile(targetActor, pileData, { interactingToken: interactingTokenDocument });
  }

  /**
   * Toggles a pile's locked state if it is enabled and a container
   *
   * @param {Token/TokenDocument} target          Target pile to lock or unlock
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise/boolean}
   */
  static toggleItemPileLocked(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;
    const pileData = PileUtilities.getActorFlagData(targetActor);
    if (!pileData?.enabled || !pileData?.isContainer) return false;
    if (pileData.locked) {
      return this.unlockItemPile(targetActor, interactingTokenDocument);
    }
    return this.lockItemPile(targetActor, interactingTokenDocument);
  }

  /**
   * Causes the item pile to play a sound as it was attempted to be opened, but was locked
   *
   * @param {Token/TokenDocument} target
   * @param {Token/TokenDocument/boolean} [interactingToken=false]
   *
   * @return {Promise<boolean>}
   */
  static rattleItemPile(target, interactingToken = false) {
    const targetActor = Utilities.getActor(target);
    const interactingTokenDocument = interactingToken ? Utilities.getActor(interactingToken) : false;

    const pileData = PileUtilities.getActorFlagData(targetActor);

    if (!pileData?.enabled || !pileData?.isContainer || !pileData?.locked) return false;

    Helpers.hooks.call(HOOKS.PILE.PRE_RATTLE, targetActor, pileData, interactingTokenDocument);

    if (pileData.lockedSound) {
      let sound = pileData.lockedSound;
      if (pileData.lockedSound.includes("*")) {
        sound = Helpers.random_array_element(pileData.lockedSounds)
      }
      AudioHelper.play({ src: sound }, true);
    }

    return ItemPileSocket.executeForEveryone(ItemPileSocket.HANDLERS.CALL_HOOK, HOOKS.PILE.RATTLE, Utilities.getUuid(targetActor), pileData, Utilities.getUuid(interactingTokenDocument));
  }

  /**
   * Whether an item pile is locked. If it is not enabled or not a container, it is always false.
   *
   * @param {Token/TokenDocument} target
   *
   * @return {boolean}
   */
  static isItemPileLocked(target) {
    return PileUtilities.isItemPileLocked(target);
  }

  /**
   * Whether an item pile is closed. If it is not enabled or not a container, it is always false.
   *
   * @param {Token/TokenDocument} target
   *
   * @return {boolean}
   */
  static isItemPileClosed(target) {
    return PileUtilities.isItemPileClosed(target);
  }

  /**
   * Whether an item pile is a container. If it is not enabled, it is always false.
   *
   * @param {Token/TokenDocument} target
   *
   * @return {boolean}
   */
  static isItemPileContainer(target) {
    return PileUtilities.isItemPileContainer(target);
  }

  /**
   * Updates a pile with new data.
   *
   * @param {Actor/TokenDocument} target                                      Target token or actor to update
   * @param {object} newData                                                  New data to update the actor with
   * @param {object} options                                                  Options to pass to the function
   * @param {Token/TokenDocument/boolean} [options.interactingToken=false]    If an actor caused this update, you can pass one here to pass it along to macros that the item pile may run
   * @param {Object/boolean} [options.tokenSettings=false]                    Updates to make to the target token
   *
   * @return {Promise}
   */
  static updateItemPile(target, newData, { interactingToken = false, tokenSettings = false } = {}) {

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`updateItemPile | Could not determine the UUID, please provide a valid target`, true);

    const interactingTokenUuid = interactingToken ? Utilities.getUuid(interactingToken) : false;
    if (interactingToken && !interactingTokenUuid) throw Helpers.custom_error(`updateItemPile | Could not determine the UUID, please provide a valid target`, true);

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.UPDATE_PILE, targetUuid, newData, {
      interactingTokenUuid, tokenSettings
    });
  }

  /**
   * Deletes a pile, calling the relevant hooks.
   *
   * @param {Token/TokenDocument} target
   *
   * @return {Promise}
   */
  static deleteItemPile(target) {
    if (!PileUtilities.isValidItemPile(target)) {
      throw Helpers.custom_error(`deleteItemPile | This is not an item pile, please provide a valid target`, true);
    }
    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`deleteItemPile | Could not determine the UUID, please provide a valid target`, true);
    if (!targetUuid.includes("Token")) {
      throw Helpers.custom_error(`deleteItemPile | Please provide a Token or TokenDocument`, true);
    }
    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.DELETE_PILE, targetUuid);
  }

  /**
   * Splits an item pile's content between all players (or a specified set of target actors).
   *
   * @param target {Token/TokenDocument/Actor}                                                  The item pile to split
   * @param {object} options                                                                    Options to pass to the function
   * @param {boolean/TokenDocument/Actor/Array<TokenDocument/Actor>} [options.targets=false]    The targets to receive the split contents
   * @param {boolean/TokenDocument/Actor} [options.instigator=false]                            Whether this was triggered by a specific actor
   *
   * @returns {Promise<object/boolean>}
   */
  static async splitItemPileContents(target, { targets = false, instigator = false } = {}) {

    if (!PileUtilities.isValidItemPile(target)) return false;

    const itemPileUuid = Utilities.getUuid(target);
    if (!itemPileUuid) throw Helpers.custom_error(`SplitItemPileContents | Could not determine the UUID, please provide a valid item pile`, true)

    const itemPileActor = Utilities.getActor(target);

    if (targets) {
      if (!Array.isArray(targets)) {
        targets = [targets]
      }
      targets.forEach(actor => {
        if (!(actor instanceof TokenDocument || actor instanceof Actor)) {
          throw Helpers.custom_error("SplitItemPileContents | Each of the entries in targets must be of type TokenDocument or Actor")
        }
      })
      targets = targets.map(target => target?.character ?? target?.actor ?? target);
    }

    if (instigator && !(instigator instanceof TokenDocument || instigator instanceof Actor)) {
      throw Helpers.custom_error("SplitItemPileContents | instigator must be of type TokenDocument or Actor")
    }

    const actorUuids = (targets || SharingUtilities.getPlayersForItemPile(itemPileActor).map(u => u.character)).map(actor => Utilities.getUuid(actor));

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.SPLIT_PILE, itemPileUuid, actorUuids, game.user.id, instigator);

  }

  /* ================= ITEM AND ATTRIBUTE METHODS ================= */

  /**
   * Adds item to an actor, increasing item quantities if matches were found
   *
   * @param {Actor/TokenDocument/Token} target                  The target to add an item to
   * @param {Array} items                                       An array of objects, with the key "item" being an item object or an Item class (the foundry class), with an optional key of "quantity" being the amount of the item to add
   * @param {object} options                                    Options to pass to the function
   * @param {boolean} [options.mergeSimilarItems=true]          Whether to merge similar items based on their name and type
   * @param {boolean} [options.removeExistingActorItems=false]  Whether to remove the actor's existing items before adding the new ones
   * @param {string/boolean} [options.interactionId=false]      The interaction ID of this action
   *
   * @returns {Promise<array>}                                  An array of objects, each containing the item that was added or updated, and the quantity that was added
   */
  static addItems(target, items, {
    mergeSimilarItems = true,
    removeExistingActorItems = false,
    interactionId = false
  } = {}) {
    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`addItems | Could not determine the UUID, please provide a valid target`, true)

    const itemsToAdd = []
    items.forEach(itemData => {

      let item = itemData;
      if (itemData instanceof Item) {
        item = itemData.toObject();
      } else if (itemData.item instanceof Item) {
        item = itemData.item.toObject();
      } else if (itemData.item) {
        item = itemData.item;
      }

      if (itemData?.quantity !== undefined) {
        Utilities.setItemQuantity(item, itemData.quantity);
      }

      const existingItems = mergeSimilarItems ? Utilities.findSimilarItem(itemsToAdd, item) : false;
      if (existingItems) {
        Utilities.setItemQuantity(existingItems, Utilities.getItemQuantity(existingItems) + Utilities.getItemQuantity(item));
      } else {
        itemsToAdd.push(item);
      }

    });

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`addItems | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.ADD_ITEMS, targetUuid, itemsToAdd, game.user.id, {
      removeExistingActorItems,
      interactionId
    });
  }

  /**
   * Subtracts the quantity of items on an actor. If the quantity of an item reaches 0, the item is removed from the actor.
   *
   * @param {Actor/Token/TokenDocument} target                  The target to remove a items from
   * @param {Array} items                                       An array of objects each containing the item id (key "_id") and the quantity to remove (key "quantity"), or Items (the foundry class) or strings of IDs to remove all quantities of
   * @param {object} options                                    Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]      The interaction ID of this action
   *
   * @returns {Promise<array>}                                  An array of objects, each containing the item that was removed or updated, the quantity that was removed, and whether the item was deleted
   */
  static removeItems(target, items, { interactionId = false } = {}) {

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`removeItems | Could not determine the UUID, please provide a valid target`, true);

    const targetActorItems = this.getActorItems(target);

    items = items.map(itemData => {

      let item;
      if (typeof itemData === "string" || itemData._id) {
        const itemId = typeof itemData === "string" ? itemData : itemData._id;
        item = targetActorItems.find(actorItem => actorItem.id === itemId);
        if (!item) {
          throw Helpers.custom_error(`removeItems | Could not find item with id "${itemId}" on target "${targetUuid}"`, true)
        }
        item = item.toObject();
      } else {
        if (itemData.item instanceof Item) {
          item = itemData.item.toObject();
        } else if (itemData instanceof Item) {
          item = itemData.toObject();
        } else {
          item = itemData.item;
        }
        let foundActorItem = targetActorItems.find(actorItem => actorItem.id === item._id);
        if (!foundActorItem) {
          throw Helpers.custom_error(`removeItems | Could not find item with id "${item._id}" on target "${targetUuid}"`, true)
        }
      }

      return {
        _id: item._id, quantity: itemData?.quantity ?? Utilities.getItemQuantity(item)
      }
    });

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`removeItems | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.REMOVE_ITEMS, targetUuid, items, game.user.id, { interactionId });
  }

  /**
   * Transfers items from the source to the target, subtracting a number of quantity from the source's item and adding it to the target's item, deleting items from the source if their quantity reaches 0
   *
   * @param {Actor/Token/TokenDocument} source              The source to transfer the items from
   * @param {Actor/Token/TokenDocument} target              The target to transfer the items to
   * @param {Array} items                                   An array of objects each containing the item id (key "_id") and the quantity to transfer (key "quantity"), or Items (the foundry class) or strings of IDs to transfer all quantities of
   * @param {object} options                                Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]  The interaction ID of this action
   *
   * @returns {Promise<object>}                             An array of objects, each containing the item that was added or updated, and the quantity that was transferred
   */
  static transferItems(source, target, items, { interactionId = false } = {}) {

    const sourceUuid = Utilities.getUuid(source);
    if (!sourceUuid) throw Helpers.custom_error(`transferItems | Could not determine the UUID, please provide a valid source`, true)

    const sourceActorItems = PileUtilities.getActorItems(source);

    items = items.map(itemData => {

      let item;
      if (typeof itemData === "string" || itemData._id) {
        const itemId = typeof itemData === "string" ? itemData : itemData._id;
        item = sourceActorItems.find(actorItem => actorItem.id === itemId);
        if (!item) {
          throw Helpers.custom_error(`transferItems | Could not find item with id "${itemId}" on target "${sourceUuid}"`, true)
        }
        item = item.toObject();
      } else if (itemData instanceof Item) {
        item = itemData.toObject();
      } else if (itemData.item instanceof Item) {
        item = itemData.item.toObject();
      } else {
        item = itemData.item;
      }

      let foundActorItem = sourceActorItems.find(actorItem => actorItem.id === item._id);
      if (!foundActorItem) {
        throw Helpers.custom_error(`transferItems | Could not find item with id "${item._id}" on target "${sourceUuid}"`, true)
      }

      return {
        _id: item._id, quantity: Math.max((itemData?.quantity ?? 0) ?? Utilities.getItemQuantity(itemData))
      }
    });

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`transferItems | Could not determine the UUID, please provide a valid target`, true)

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`transferItems | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRANSFER_ITEMS, sourceUuid, targetUuid, items, game.user.id, { interactionId });

  }

  /**
   * Transfers all items between the source and the target.
   *
   * @param {Actor/Token/TokenDocument} source                The actor to transfer all items from
   * @param {Actor/Token/TokenDocument} target                The actor to receive all the items
   * @param {object} options                                  Options to pass to the function
   * @param {Array/boolean} [options.itemFilters=false]       Array of item types disallowed - will default to module settings if none provided
   * @param {string/boolean} [options.interactionId=false]    The interaction ID of this action
   *
   * @returns {Promise<array>}                                An array containing all the items that were transferred to the target
   */
  static transferAllItems(source, target, { itemFilters = false, interactionId = false } = {}) {

    const sourceUuid = Utilities.getUuid(source);
    if (!sourceUuid) throw Helpers.custom_error(`transferAllItems | Could not determine the UUID, please provide a valid source`, true)

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`transferAllItems | Could not determine the UUID, please provide a valid target`, true)

    if (itemFilters) {
      if (!Array.isArray(itemFilters)) throw Helpers.custom_error(`transferAllItems | itemFilters must be of type array`);
      itemFilters.forEach(entry => {
        if (typeof entry?.path !== "string") throw Helpers.custom_error(`transferAllItems | each entry in the itemFilters must have a "path" property that is of type string`);
        if (typeof entry?.filter !== "string") throw Helpers.custom_error(`transferAllItems | each entry in the itemFilters must have a "filter" property that is of type string`);
      })
    }

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`transferAllItems | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRANSFER_ALL_ITEMS, sourceUuid, targetUuid, game.user.id, {
      itemFilters, interactionId
    });
  }

  /**
   * Sets attributes on an actor
   *
   * @param {Actor/Token/TokenDocument} target                  The target whose attribute will have their quantity set
   * @param {object} attributes                                 An object with each key being an attribute path, and its value being the quantity to set
   * @param {object} options                                    Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]      The interaction ID of this action
   *
   * @returns {Promise<object>}                                 An array containing a key value pair of the attribute path and the quantity of that attribute that was set
   *
   */
  static setAttributes(target, attributes, { interactionId = false } = {}) {

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`setAttributes | Could not determine the UUID, please provide a valid target`, true)

    const targetActor = Utilities.getActor(target);

    Object.entries(attributes).forEach(entry => {
      const [attribute, quantity] = entry;
      if (!hasProperty(targetActor, attribute)) {
        throw Helpers.custom_error(`setAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
      }
      if (!Helpers.isRealNumber(quantity)) {
        throw Helpers.custom_error(`setAttributes | Attribute "${attribute}" must be of type number`, true)
      }
    });

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`setAttributes | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.SET_ATTRIBUTES, targetUuid, attributes, game.user.id, { interactionId });

  }

  /**
   * Adds attributes on an actor
   *
   * @param {Actor/Token/TokenDocument} target                  The target whose attribute will have a set quantity added to it
   * @param {object} attributes                                 An object with each key being an attribute path, and its value being the quantity to add
   * @param {object} options                                    Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]      The interaction ID of this action
   *
   * @returns {Promise<object>}                                 An array containing a key value pair of the attribute path and the quantity of that attribute that was added
   *
   */
  static addAttributes(target, attributes, { interactionId = false } = {}) {

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`addAttributes | Could not determine the UUID, please provide a valid target`, true)

    const targetActor = Utilities.getActor(target);

    Object.entries(attributes).forEach(entry => {
      const [attribute, quantity] = entry;
      if (!hasProperty(targetActor, attribute)) {
        throw Helpers.custom_error(`addAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
      }
      if (!Helpers.isRealNumber(quantity) && quantity > 0) {
        throw Helpers.custom_error(`addAttributes | Attribute "${attribute}" must be of type number and greater than 0`, true)
      }
    });

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`addAttributes | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.ADD_ATTRIBUTES, targetUuid, attributes, game.user.id, { interactionId });

  }

  /**
   * Subtracts attributes on the target
   *
   * @param {Token/TokenDocument} target                      The target whose attributes will be subtracted from
   * @param {Array/object} attributes                         This can be either an array of attributes to subtract (to zero out a given attribute), or an object with each key being an attribute path, and its value being the quantity to subtract
   * @param {object} options                                  Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]    The interaction ID of this action
   *
   * @returns {Promise<object>}                               An array containing a key value pair of the attribute path and the quantity of that attribute that was removed
   */
  static removeAttributes(target, attributes, { interactionId = false } = {}) {

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`removeAttributes | Could not determine the UUID, please provide a valid target`, true)

    const targetActor = Utilities.getActor(target);

    let attributesToSend = {};
    if (Array.isArray(attributes)) {
      attributes.forEach(attribute => {
        if (typeof attribute !== "string") {
          throw Helpers.custom_error(`removeAttributes | Each attribute in the array must be of type string`, true)
        }
        if (!hasProperty(targetActor, attribute)) {
          throw Helpers.custom_error(`removeAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
        }
        attributesToSend[attribute] = Number(getProperty(targetActor, attribute));
      });
    } else {
      Object.entries(attributes).forEach(entry => {
        const [attribute, quantity] = entry;
        if (!hasProperty(targetActor, attribute)) {
          throw Helpers.custom_error(`removeAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
        }
        if (!Helpers.isRealNumber(quantity) && quantity > 0) {
          throw Helpers.custom_error(`removeAttributes | Attribute "${attribute}" must be of type number and greater than 0`, true)
        }
      });
      attributesToSend = attributes;
    }

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`removeAttributes | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.REMOVE_ATTRIBUTES, targetUuid, attributesToSend, game.user.id, { interactionId });

  }

  /**
   * Transfers a set quantity of an attribute from a source to a target, removing it or subtracting from the source and adds it the target
   *
   * @param {Actor/Token/TokenDocument} source                The source to transfer the attribute from
   * @param {Actor/Token/TokenDocument} target                The target to transfer the attribute to
   * @param {Array/object} attributes                         This can be either an array of attributes to transfer (to transfer all of a given attribute), or an object with each key being an attribute path, and its value being the quantity to transfer
   * @param {object} options                                  Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]    The interaction ID of this action
   *
   * @returns {Promise<object>}                               An object containing a key value pair of each attribute transferred, the key being the attribute path and its value being the quantity that was transferred
   */
  static transferAttributes(source, target, attributes, { interactionId = false } = {}) {

    const sourceUuid = Utilities.getUuid(source);
    if (!sourceUuid) throw Helpers.custom_error(`transferAttributes | Could not determine the UUID, please provide a valid source`, true)
    const sourceActor = Utilities.getActor(source);

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`transferAttributes | Could not determine the UUID, please provide a valid target`, true)
    const targetActor = Utilities.getActor(target);

    if (Array.isArray(attributes)) {
      attributes.forEach(attribute => {
        if (typeof attribute !== "string") {
          throw Helpers.custom_error(`transferAttributes | Each attribute in the array must be of type string`, true)
        }
        if (!hasProperty(sourceActor, attribute)) {
          throw Helpers.custom_error(`transferAttributes | Could not find attribute ${attribute} on source's actor with UUID "${targetUuid}"`, true)
        }
        if (!hasProperty(targetActor, attribute)) {
          throw Helpers.custom_error(`transferAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
        }
      });
    } else {
      Object.entries(attributes).forEach(entry => {
        const [attribute, quantity] = entry;
        if (!hasProperty(sourceActor, attribute)) {
          throw Helpers.custom_error(`transferAttributes | Could not find attribute ${attribute} on source's actor with UUID "${targetUuid}"`, true)
        }
        if (!hasProperty(targetActor, attribute)) {
          throw Helpers.custom_error(`transferAttributes | Could not find attribute ${attribute} on target's actor with UUID "${targetUuid}"`, true)
        }
        if (!Helpers.isRealNumber(quantity) && quantity > 0) {
          throw Helpers.custom_error(`transferAttributes | Attribute "${attribute}" must be of type number and greater than 0`, true)
        }
      });
    }

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`transferAttributes | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRANSFER_ATTRIBUTES, sourceUuid, targetUuid, attributes, game.user.id, { interactionId });

  }

  /**
   * Transfers all dynamic attributes from a source to a target, removing it or subtracting from the source and adding them to the target
   *
   * @param {Actor/Token/TokenDocument} source                The source to transfer the attributes from
   * @param {Actor/Token/TokenDocument} target                The target to transfer the attributes to
   * @param {object} options                                  Options to pass to the function
   * @param {string/boolean} [options.interactionId=false]    The interaction ID of this action
   *
   * @returns {Promise<object>}                               An object containing a key value pair of each attribute transferred, the key being the attribute path and its value being the quantity that was transferred
   */
  static transferAllAttributes(source, target, { interactionId = false } = {}) {

    const sourceUuid = Utilities.getUuid(source);
    if (!sourceUuid) throw Helpers.custom_error(`transferAllAttributes | Could not determine the UUID, please provide a valid source`, true);

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`transferAllAttributes | Could not determine the UUID, please provide a valid target`, true);

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`transferAllAttributes | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRANSFER_ALL_ATTRIBUTES, sourceUuid, targetUuid, game.user.id, { interactionId });

  }

  /**
   * Transfers all items and attributes between the source and the target.
   *
   * @param {Actor/Token/TokenDocument} source                The actor to transfer all items and attributes from
   * @param {Actor/Token/TokenDocument} target                The actor to receive all the items and attributes
   * @param {object} options                                  Options to pass to the function
   * @param {Array/boolean} [options.itemFilters=false]       Array of item types disallowed - will default to module settings if none provided
   * @param {string/boolean} [options.interactionId=false]    The ID of this interaction
   *
   * @returns {Promise<object>}                               An object containing all items and attributes transferred to the target
   */
  static transferEverything(source, target, { itemFilters = false, interactionId = false } = {}) {

    const sourceUuid = Utilities.getUuid(source);
    if (!sourceUuid) throw Helpers.custom_error(`transferEverything | Could not determine the UUID, please provide a valid source`, true)

    const targetUuid = Utilities.getUuid(target);
    if (!targetUuid) throw Helpers.custom_error(`transferEverything | Could not determine the UUID, please provide a valid target`, true)

    if (itemFilters) {
      if (!Array.isArray(itemFilters)) throw Helpers.custom_error(`transferEverything | itemFilters must be of type array`);
      itemFilters.forEach(entry => {
        if (typeof entry?.path !== "string") throw Helpers.custom_error(`transferEverything | each entry in the itemFilters must have a "path" property that is of type string`);
        if (typeof entry?.filter !== "string") throw Helpers.custom_error(`transferEverything | each entry in the itemFilters must have a "filter" property that is of type string`);
      })
    }

    if (interactionId) {
      if (typeof interactionId !== "string") throw Helpers.custom_error(`transferEverything | interactionId must be of type string`);
    }

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRANSFER_EVERYTHING, sourceUuid, targetUuid, game.user.id, {
      itemFilters, interactionId
    });

  }

  /**
   * Rolls on a table of items and collates them to be able to be added to actors and such
   *
   * @param {string/RollTable} table                              The name, ID, UUID, or the table itself, or an array of such
   * @param {object} options                                      Options to pass to the function
   * @param {string/number} [options.timesToRoll="1"]             The number of times to roll on the tables, which can be a roll formula
   * @param {boolean} [options.resetTable=true]                   Whether to reset the table before rolling it
   * @param {boolean} [options.displayChat=false]                 Whether to display the rolls to the chat
   * @param {object} [options.rollData={}]                        Data to inject into the roll formula
   * @param {Actor/string/boolean} [options.targetActor=false]    The target actor to add the items to, or the UUID of an actor
   * @param {boolean} [options.removeExistingActorItems=false]    Whether to clear the target actor's items before adding the ones rolled
   *
   * @returns {Promise<Array<Item>>}                              An array of object containing the item data and their quantity
   */
  static async rollItemTable(table, {
    timesToRoll = "1",
    resetTable = true,
    displayChat = false,
    rollData = {},
    targetActor = false,
    removeExistingActorItems = false
  } = {}) {

    if (typeof table === "string") {
      let potentialTable = fromUuidSync(table);
      if (!potentialTable) {
        potentialTable = game.tables.get(table)
      }
      if (!potentialTable) {
        potentialTable = game.tables.getName(table)
      }
      if (!potentialTable) {
        throw Helpers.custom_error(`rollItemTable | could not find table with string "${table}"`);
      }
      table = potentialTable;
    }

    if (!(table instanceof RollTable)) {
      throw Helpers.custom_error(`rollItemTable | table must be of type RollTable`);
    }

    if (!(typeof timesToRoll === "string" || typeof timesToRoll === "number")) {
      throw Helpers.custom_error(`rollItemTable | timesToRoll of type string or number`);
    }

    if (typeof rollData !== "object") {
      throw Helpers.custom_error(`rollItemTable | rollData of type object`);
    }

    if (typeof removeExistingActorItems !== "boolean") {
      throw Helpers.custom_error(`rollItemTable | removeExistingActorItems of type boolean`);
    }

    if (targetActor) {
      const actor = Utilities.getActor(targetActor);
      if (!(actor instanceof Actor)) {
        throw Helpers.custom_error(`rollItemTable | could not find the actor of the target actor`);
      }
    }

    if (resetTable) {
      await table.reset();
    }
    await table.normalize();
    const roll = new Roll(timesToRoll.toString(), rollData).evaluate({ async: false });

    if (roll.total <= 0) {
      return [];
    }

    const tableDraw = await table.drawMany(roll.total, { displayChat, recursive: true });
    const items = [];
    for (const rollData of tableDraw.results) {
      const existingItem = items.find(
        (item) => item.documentId === rollData.documentId
      );
      if (existingItem) {
        existingItem.quantity++;
      } else {

        let item;
        if (rollData.documentCollection === "Item") {
          item = game.items.get(rollData.documentId);
        } else {
          const compendium = game.packs.get(rollData.documentCollection);
          if (compendium) {
            item = await compendium.getDocument(rollData.documentId);
          }
        }

        if (item instanceof Item) {
          items.push({
            ...rollData,
            item: item,
            quantity: 1,
          });
        }
      }
    }

    if (targetActor) {
      const actor = Utilities.getActor(targetActor);
      await this.addItems(actor, items, { removeExistingActorItems });
    }

    return items;

  }

  static getActorItems(actor) {
    return PileUtilities.getActorItems(actor);
  }

  static getActorCurrencies(actor, { getAll = false } = {}) {
    return PileUtilities.getActorCurrencies(actor, { getAll });
  }

  static updateTokenHud() {
    return ItemPileSocket.executeForEveryone(ItemPileSocket.HANDLERS.RERENDER_TOKEN_HUD);
  }

  static requestTrade(user) {
    return TradeAPI._requestTrade(user);
  }

  static spectateTrade(tradeId) {
    return TradeAPI._spectateTrade(tradeId);
  }

  /**
   * Renders the appropriate interface for a given actor
   *
   * @param {Actor/TokenDocument} target                    The actor whose interface to render
   * @param {object} options                                An object containing the options for this method
   * @param {Array<string>} options.userIds                 An array of strings for each user to render the interface for (defaults to only self)
   * @param {Actor/TokenDocument} options.inspectingTarget  Sets what actor should be viewing the interface
   * @param {boolean} options.useDefaultCharacter           Whether other users should use their assigned character when rendering the interface
   *
   * @returns {Promise}
   */
  static renderItemPileInterface(target, {
    userIds = null, inspectingTarget = false, useDefaultCharacter = false
  } = {}) {

    const targetDocument = Utilities.getDocument(target);
    const targetUuid = Utilities.getUuid(targetDocument);
    if (!targetUuid) throw Helpers.custom_error(`renderItemPileInterface | Could not determine the UUID, please provide a valid target item pile`);

    if (!PileUtilities.isValidItemPile(targetDocument)) {
      throw Helpers.custom_error("renderItemPileInterface | This target is not a valid item pile")
    }

    if (!inspectingTarget && !useDefaultCharacter) {
      useDefaultCharacter = true;
    }

    if (inspectingTarget && useDefaultCharacter) {
      throw Helpers.custom_error("renderItemPileInterface | You cannot force users to use both their default character and a specific character to inspect the pile")
    }

    const inspectingTargetUuid = inspectingTarget ? Utilities.getUuid(inspectingTarget) : false;
    if (inspectingTarget && !inspectingTargetUuid) throw Helpers.custom_error(`renderItemPileInterface | Could not determine the UUID, please provide a valid inspecting target`);

    if (!Array.isArray(userIds)) {
      if (userIds === null) {
        userIds = [game.user.id];
      } else {
        userIds = [userIds]
      }
    }

    if (!game.user.isGM) {
      if (userIds.length > 1 || !userIds.includes(game.user.id)) {
        throw Helpers.custom_error(`renderItemPileInterface | You are not a GM, so you cannot force others to render an item pile's interface`);
      }
      userIds = [game.user.id];
    }

    if (userIds.length === 1 && userIds[0] === game.user.id) {
      return PrivateAPI._renderItemPileInterface(targetUuid, {
        inspectingTargetUuid, useDefaultCharacter, remote: true
      })
    }

    for (const userId of userIds) {
      const user = game.users.get(userId);
      if (!user) throw Helpers.custom_error(`renderItemPileInterface | No user with ID "${userId}" exists`);
      if (user.isGM) continue;
      if (useDefaultCharacter) {
        if (!user.character) {
          Helpers.custom_warning(`renderItemPileInterface | User "${user.name}" has no default character`, true);
          return;
        }
      }
    }

    return ItemPileSocket.executeForUsers(ItemPileSocket.HANDLERS.RENDER_INTERFACE, userIds, targetUuid, {
      inspectingTargetUuid, useDefaultCharacter, remote: true
    });

  }

  /**
   *  Get the prices array for a given item
   *
   * @param {Item} item                             Item to get the price for
   * @param {object} options                        Options to pass to the function
   * @param {Actor/boolean} [options.seller=false]  Actor that is selling the item
   * @param {Actor/boolean} [options.buyer=false]   Actor that is buying the item
   * @param {number} [options.quantity=1]           Quantity of item to buy
   *
   * @returns {Array}                               Array containing all the different purchase options for this item
   */
  static getPricesForItem(item, { seller = false, buyer = false, quantity = 1 } = {}) {

    if (!(item instanceof Item)) {
      throw Helpers.custom_error("getPricesForItem | The given item must be of type Item");
    }

    if (seller) {
      seller = Utilities.getActor(seller);
      if (!seller) {
        throw Helpers.custom_error("getPricesForItem | Could not determine actor for the seller");
      }
    } else {
      if (!item.parent) {
        throw Helpers.custom_error("getPricesForItem | If no seller was given, the item must belong to an actor");
      }
      seller = Utilities.getActor(item.parent);
    }

    if (buyer) {
      buyer = Utilities.getActor(buyer);
      if (!buyer) {
        throw Helpers.custom_error(`getPricesForItem | Could not determine the actor for the buyer`);
      }
    }

    return PileUtilities.getItemPrices(item, { seller, buyer, quantity });

  }

  /**
   * Trades multiple items between one actor to another, and currencies and/or change is exchanged between them
   *
   * @param {Actor/Token/TokenDocument} seller                                                    The actor that is selling the item
   * @param {Actor/Token/TokenDocument} buyer                                                     The actor that is buying the item
   * @param {Array<Object<{ item: Item/string, quantity: number, paymentIndex: number }>>} items  An array of objects containing the item or the id of the
   *                                                                                              item to be sold, the quantity to be sold, and the payment
   *                                                                                              index to be used
   * @param {string/boolean} [interactionId=false]                                                The ID of this interaction
   *
   * @returns {Promise<Object>}                       The items that were created and the attributes that were changed
   */
  static tradeItems(seller, buyer, items, { interactionId = false } = {}) {

    const sellerActor = Utilities.getActor(seller);
    const sellerUuid = Utilities.getUuid(sellerActor);
    if (!sellerUuid) {
      throw Helpers.custom_error(`tradeItems | Could not determine the UUID of the seller, please provide a valid actor or token`, true);
    }

    const buyerActor = Utilities.getActor(buyer);
    const buyerUuid = Utilities.getUuid(buyer);
    if (!buyerUuid) {
      throw Helpers.custom_error(`tradeItems | Could not determine the UUID of the buyer, please provide a valid actor or token`, true);
    }

    const itemsToSell = items.map(data => {

      data = foundry.utils.mergeObject({
        item: "", quantity: 1, paymentIndex: 0
      }, data);

      if (!data.item) {
        throw Helpers.custom_error(`tradeItems | You must provide an item!`, true);
      }

      let actorItem;
      if (typeof data.item === "string") {
        actorItem = sellerActor.items.get(data.item) || sellerActor.items.getName(data.item);
        if (!actorItem) {
          throw Helpers.custom_error(`tradeItems | Could not find item on seller with identifier "${data.item}"`);
        }
      } else {
        actorItem = sellerActor.items.get(data.item instanceof Item ? data.item.id : data.item._id) || sellerActor.items.getName(data.item.name);
        if (!actorItem) {
          throw Helpers.custom_error(`tradeItems | Could not find provided item on seller`);
        }
      }

      const itemPrices = PileUtilities.getItemPrices(actorItem, {
        seller: sellerActor, buyer: buyerActor, quantity: data.quantity
      });
      if (itemPrices.length) {
        if (data.paymentIndex >= itemPrices.length || data.paymentIndex < 0) {
          throw Helpers.custom_error(`tradeItems | That payment index does not exist on ${actorItem.name}`, true);
        }

        const selectedPrice = itemPrices[data.paymentIndex];
        if (data.quantity > selectedPrice.maxQuantity) {
          throw Helpers.custom_error(`tradeItems | The buyer actor cannot afford ${data.quantity} of ${actorItem.name} (max ${selectedPrice.maxQuantity})`, true);
        }
      }

      return {
        id: actorItem.id, quantity: data.quantity, paymentIndex: data.paymentIndex
      };

    });

    return ItemPileSocket.executeAsGM(ItemPileSocket.HANDLERS.TRADE_ITEMS, sellerUuid, buyerUuid, itemsToSell, game.user.id, { interactionId });

  }

}

export default API;