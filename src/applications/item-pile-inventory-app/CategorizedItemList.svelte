<script>

  import { localize } from '@typhonjs-fvtt/runtime/svelte/helper';
  import { fade } from 'svelte/transition';
  import ListEntry from "./ListEntry.svelte";

  export let store;
  const numItems = store.numItems;
  const categories = store.categories;
  const itemsPerCategory = store.itemsPerCategory;

</script>


{#if $numItems > 0}

  <div in:fade|local={{duration: 150}}>

    {#each $categories as category, index (category.type)}
      <div class="item-group-type item-piles-flexrow">
        <h3>{localize(category.label)}</h3>
      </div>

      <div class="item-piles-items-list">
        {#each $itemsPerCategory[category.type] as item (item.id)}
          <ListEntry {store} bind:entry={item}/>
        {/each}
      </div>
    {/each}

  </div>

{/if}

<style lang="scss">

  .item-group-type {
    border-bottom: 1px solid rgba(0, 0, 0, 0.2);
    margin: 0.5rem 0 0.25rem 0;
    padding-right: 10px;
    height: 1.5rem;
    align-items: center;
  }

</style>