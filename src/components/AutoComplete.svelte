<div class="w-96 flex flex-col">
  <input type="text" class="w-full" bind:value={text} />

  <div class="my-2 flex">
    Počet výsledků {count}
    <div class="ml-auto">
      start {start} end {end}
    </div>
  </div>

  <VirtualList
    width="100%"
    height={200}
    itemCount={count}
    itemSize={30}
    on:itemsUpdated={onItemsUpdated}
  >
    <div slot="item" let:index let:style {style}>
      #{index}
    </div>
  </VirtualList>
</div>

<script lang="ts">
  import VirtualList from 'svelte-tiny-virtual-list'

  let count = 1000
  let text = ''
  let start: number, end: number

  interface EventItemsUpdated extends Event {
    readonly detail: {
      start: number
      end: number
    }
  }

  function onItemsUpdated({ detail }: EventItemsUpdated) {
    start = detail.start
    end = detail.end
  }
</script>
