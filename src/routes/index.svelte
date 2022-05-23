<script lang="ts">
  import { onMount } from 'svelte';
  import AutoComplete from '~/components/AutoComplete.svelte'

  let testValues = null;

  async function getTest(): Promise<EndpointOutput> {
    //const res = await fetch('/api/diag');
    //const res = await fetch('/api/diag?limit=10&offset=1');    
    const res = await fetch('/api/diag?limit=5&offset=0&searchedText=chol');
    const data = await res.json();
    return { body: data };
  }


  onMount(async () => {
    testValues = await getTest();
    console.warn( JSON.stringify(testValues, undefined, 4) );
  });
</script>


<AutoComplete />
