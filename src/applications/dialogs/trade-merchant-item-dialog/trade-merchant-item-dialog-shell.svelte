<script>
  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { getContext } from "svelte";
  import { ApplicationShell } from "@typhonjs-fvtt/runtime/svelte/component/core";
  import { get } from "svelte/store";
  import * as PileUtilities from "../../../helpers/pile-utilities.js";
  import PriceSelector from "../../components/PriceSelector.svelte";

  const { application } = getContext('external');

  export let item;
  export let seller;
  export let buyer;
  export let settings;
  export let elementRoot;
  export let store = item.store;

  const itemName = item.name;
  const itemImg = item.img;
  const itemFlagData = item.itemFlagData;
  const quantityToBuy = item.quantityToBuy;
  const itemMaxQuantityStore = item.quantity;
  const prices = item.prices;

  const sellerPileData = store.pileData;
  const buyerPileData = store.recipientPileData;

  let maxItemPurchaseQuantity;
  let currentQuantityToBuy;

  const selectedPriceGroup = item.selectedPriceGroup;
  $: {
    $selectedPriceGroup;
    currentQuantityToBuy = 1;
    $quantityToBuy = 1;
  }

  let paymentData = {};
  $: {
    paymentData = PileUtilities.getPricesForItems([{
      item: item.item,
      quantity: $quantityToBuy,
      paymentIndex: $selectedPriceGroup
    }], {
      seller,
      buyer,
      sellerFlagData: $sellerPileData,
      buyerFlagData: $buyerPileData,
    });
  }

  $: maxMerchantItemQuantity = $sellerPileData.infiniteQuantity ? Infinity : $itemMaxQuantityStore;
  $: maxItemQuantity = $prices[$selectedPriceGroup]?.maxQuantity ?? Infinity;
  $: maxItemPurchaseQuantity = Math.min(maxItemQuantity, maxMerchantItemQuantity);

  function submit() {
    game.itempiles.API.tradeItems(seller, buyer, [{
      item: item.item,
      paymentIndex: get(selectedPriceGroup),
      quantity: get(quantityToBuy),
    }], {
      interactionId: store.interactionId
    });
    application.options.resolve();
    application.close();
  }

</script>

<svelte:options accessors={true}/>

<ApplicationShell bind:elementRoot>
  <div>

    <div style="display: grid; grid-template-columns: 1fr 0.75fr; margin-bottom: 0.5rem;">
      <div style="display:flex; align-items: center; font-size:1rem; grid-row: 1;">
        <div class="item-piles-img-container" style="margin-right: 0.25rem;">
          <img class="item-piles-img" src={$itemImg}/>
        </div>
        <span>{localize($itemName)}</span>
      </div>

      <div
        style="display:flex; justify-content:flex-end; align-items: center; text-align: right;">
        {#if maxItemQuantity}
          <div style="display: flex; flex-direction: column; align-items: flex-end; margin-right: 0.5rem;">
            <small>{localize("ITEM-PILES.Applications.TradeMerchantItem.Quantity")}</small>
            <small style="font-style:italic;">
              ({localize("ITEM-PILES.Applications.TradeMerchantItem.MaxQuantity", {
              quantity: maxItemPurchaseQuantity
            })})
            </small>
          </div>
          <input style="max-width: 40px; max-height: 24px;" type="number" bind:value={currentQuantityToBuy} on:change={(evt) => {
            $quantityToBuy = Math.max(1, Math.min(currentQuantityToBuy, maxItemPurchaseQuantity));
            currentQuantityToBuy = $quantityToBuy;
          }}/>
        {/if}
      </div>
      <div style="margin-top: 0.25rem;">
        <PriceSelector {item} standalone/>
      </div>
      <div style="margin-right: 0.25rem; text-align: right;">
        {#if maxItemQuantity}
          {#if $quantityToBuy > 1 && paymentData.primary}
            <small>{paymentData.basePriceString}</small>
          {/if}
        {:else}
          <small>{localize(`ITEM-PILES.Applications.TradeMerchantItem.${settings.selling ? "They" : "You"}CantAfford`)}</small>
        {/if}
      </div>
    </div>

    <div style="display: grid; grid-template-columns: auto auto;" class="item-piles-bottom-divider">

      <strong class="item-piles-bottom-divider" style="margin-bottom:0.25rem; padding-bottom:0.25rem;">
        {localize("ITEM-PILES.Applications.TradeMerchantItem." + (settings.selling ? "YouReceive" : "YouPay"))}:
      </strong>

      <strong class="item-piles-bottom-divider item-piles-text-right"
              style="margin-bottom:0.25rem; padding-bottom:0.25rem;">
        {localize("ITEM-PILES.Applications.TradeMerchantItem." + (settings.selling ? "TheyReceive" : "YouReceive"))}:
      </strong>

      <div>
        {#each paymentData.finalPrices as price}
          {#if price.quantity}
            <div style="display:flex; align-items: center;">
              <div class="item-piles-img-container" style="margin-right: 0.25rem;">
                <img class="item-piles-img" src={price.img}/>
              </div>
              <span>{price.quantity} {localize(price.name)}</span>
            </div>
          {/if}
        {/each}
      </div>

      <div style="display:flex; flex-direction: column; align-items: flex-end;">
        <div style="display:flex; align-items: center;">
          <span>{$quantityToBuy > 1 ? $quantityToBuy + " " : ""}{$itemName}</span>
          <div class="item-piles-img-container" style="margin-left: 0.25rem;">
            <img class="item-piles-img" src={$itemImg}/>
          </div>
        </div>
        {#if paymentData.buyerChange.length}
          <span class="item-piles-small-text item-piles-text-right" style="margin-right: 0.25rem; margin-top: 0.5rem;">
            {localize("ITEM-PILES.Applications.TradeMerchantItem.Change")}:
          </span>
          {#each paymentData.buyerChange as change}
            {#if change.quantity}
              <div style="display:flex; align-items: center;">
                <span>{change.quantity} {localize(change.name)}</span>
                <div class="item-piles-img-container" style="margin-left: 0.25rem;">
                  <img class="item-piles-img" src={change.img}/>
                </div>
              </div>
            {/if}
          {/each}
        {/if}
      </div>

    </div>

    <footer class="sheet-footer item-piles-flexrow" style="margin-top: 1rem;">
      <button type="button" disabled={!maxItemPurchaseQuantity} on:click|once={ () => { submit() } }>
        {#if settings.selling}
          <i class="fas fa-hand-holding-usd"></i> {localize("ITEM-PILES.Applications.TradeMerchantItem.SellItem")}
        {:else}
          <i class="fas fa-shopping-cart"></i> {localize("ITEM-PILES.Applications.TradeMerchantItem.BuyItem")}
        {/if}
      </button>

      <button type="button" on:click|once={() => { application.close() }}>
        <i class="fas fa-times"></i>
        {localize("Cancel")}
      </button>
    </footer>

  </div>

</ApplicationShell>

<style lang="scss">

  .highlight {
    box-shadow: inset 0 0 13px 5px rgba(255, 117, 0, 0.73);
  }

</style>