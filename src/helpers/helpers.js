import CONSTANTS from "../constants/constants.js";

export const debounceManager = {

  debounces: {},

  setDebounce(id, method) {
    if (this.debounces[id]) {
      return this.debounces[id];
    }
    this.debounces[id] = debounce(function (...args) {
      delete debounceManager.debounces[id];
      return method(...args);
    }, 50);
    return this.debounces[id];
  }
};

export const hooks = {
  run: true,
  _hooks: {},

  async runWithout(callback) {
    this.run = false;
    await callback();
    this.run = true;
  },

  call(hook, ...args) {
    if (!this.run) return;
    return Hooks.call(hook, ...args);
  },

  callAll(hook, ...args) {
    if (!this.run) return;
    return Hooks.callAll(hook, ...args);
  },

  on(hook, callback) {
    Hooks.on(hook, (...args) => {
      if (!this.run) return;
      callback(...args);
    });
  }
}

export function wait(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * @param key
 * @returns {*}
 */
export function getSetting(key) {
  return game.settings.get(CONSTANTS.MODULE_NAME, key);
}

export function setSetting(key, value) {
  if (value === undefined) throw new Error("setSetting | value must not be undefined!");
  return game.settings.set(CONSTANTS.MODULE_NAME, key, value);
}

export function debug(msg, args = "") {
  if (game.settings.get(CONSTANTS.MODULE_NAME, "debug")) {
    console.log(`DEBUG | Item Piles | ${msg}`, args)
  }
}

export function custom_notify(message) {
  message = `Item Piles | ${message}`;
  ui.notifications.notify(message, { console: false });
  console.log(message.replace("<br>", "\n"));
}

export function custom_warning(warning, notify = false) {
  warning = `Item Piles | ${warning}`;
  if (notify) {
    ui.notifications.warn(warning, { console: false });
  }
  console.warn(warning.replace("<br>", "\n"));
}

export function custom_error(error, notify = true) {
  error = `Item Piles | ${error}`;
  if (notify) {
    ui.notifications.error(error, { console: false });
  }
  return new Error(error.replace("<br>", "\n"));
}

export function capitalizeFirstLetter(str) {
  return str.slice(0, 1).toUpperCase() + str.slice(1);
}

export function isRealNumber(inNumber) {
  return !isNaN(inNumber)
    && typeof inNumber === "number"
    && isFinite(inNumber);
}

export function isActiveGM(user) {
  return user.active && user.isGM;
}

export function getActiveGMs() {
  return game.users.filter(isActiveGM);
}

export function isResponsibleGM() {
  if (!game.user.isGM) {
    return false;
  }
  return !getActiveGMs().some(other => other.id < game.user.id);
}

export function isGMConnected() {
  return !!Array.from(game.users).find(user => user.isGM && user.active);
}

export function roundToDecimals(num, decimals) {
  return Number(Math.round(num + 'e' + decimals) + 'e-' + decimals);
}

/**
 *  This function linearly interpolates between p1 and p2 based on a normalized value of t
 *
 * @param  {string}         inFile      The start value
 * @param  {object}         inOptions   The end value
 * @return {array|boolean}              Interpolated value
 */
export async function getFiles(inFile, { applyWildCard = false, softFail = false } = {}) {

  let source = 'data';
  const browseOptions = { wildcard: applyWildCard };

  if (/\.s3\./.test(inFile)) {
    source = 's3'
    const { bucket, keyPrefix } = FilePicker.parseS3URL(inFile);
    if (bucket) {
      browseOptions.bucket = bucket;
      inFile = keyPrefix;
    }
  }

  try {
    return (await FilePicker.browse(source, inFile, browseOptions)).files;
  } catch (err) {
    if (softFail) return false;
    throw custom_error("Sequencer", `getFiles | ${err}`);
  }
}

/**
 *  Returns a floating point number between a minimum and maximum value
 *
 * @param  {number}     min                     The minimum value
 * @param  {number}     max                     The maximum value
 * @return {number}                             A random value between the range given
 */
export function random_float_between(min, max) {
  const random = Math.random();
  const _max = Math.max(max, min);
  const _min = Math.min(max, min);
  return random * (_max - _min) + _min;
}

/**
 *  Returns an integer between a minimum and maximum value
 *
 * @param  {number}     min                     The minimum value
 * @param  {number}     max                     The maximum value
 * @return {int}                                A random integer between the range given
 */
export function random_int_between(min, max) {
  return Math.floor(random_float_between(min, max));
}

/**
 *  Returns a random element in the given array
 *
 * @param  {array}   inArray                    An array
 * @param  {boolean} recurse                    Whether to recurse if the randomly chosen element is also an array
 * @return {object}                             A random element from the array
 */
export function random_array_element(inArray, { recurse = false } = {}) {
  let choice = inArray[random_int_between(0, inArray.length)];
  if (recurse && Array.isArray(choice)) {
    return random_array_element(choice, { recurse: true });
  }
  return choice;
}