<script lang="ts">  
  import AutoComplete from '~/components/AutoComplete.svelte'
  import AutoComplete2 from '~/components/AutoComplete2.svelte'

  let selected = null;

  function onSelectItem(data) {
    selected = data?.detail || null;
  }
  
</script>

{#if selected !== null}
  <h3>Vybraná diagnóza:</h3>
  <div class="px-6 py-6">
    <em class="font-bold align-middle font-mono not-italic text-3xl">{selected.KOD}</em>
    <span class="text-slate-500 align-middle px-2">{selected.NAZ}</span>
  </div>
{/if}

<AutoComplete2 searchPlaceholder="hledat diagnózu" on:selectItem={onSelectItem} />

<br /><br />
<hr />
<br /><br />

<AutoComplete2 searchPlaceholder="nacten plny seznam a hledani offline" dataChunk=200000 />
