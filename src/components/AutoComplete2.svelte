<script>
	import { onDestroy , createEventDispatcher } from "svelte";
	import VirtualList from "svelte-tiny-virtual-list";
	import InfiniteLoading from "svelte-infinite-loading";
	
	const POSTPONE_SEARCH_IN_MS = 1200;
	const dispatch = createEventDispatcher();
	
	export let dataChunk = 20;			//response limit, size of each data chunk
	export let searchPlaceholder = "";	//define any text for search input placeholder

	let dataOffset = 0;			//default -> start of list
	let dataMaxCount = null;	//default -> n/a
	let dataCount = 0;
	let dataLoadedCount = 0;
	let offlineData = null;		//used only for offline search
	let data = [];
	let start = 0, end = 0;
	let searchText = "";
	let lastSearchedText = "";
	let loadingNextData = false;	//loading current data?
	let isAllDataLoaded = false;
	let infiniteId = Symbol();
	let selectedItem = null;
	let selectedIndex = null;
	let postponeSearchTimerId = null;
	let cmp = null;

	async function fetchData() {
		let uri, res, data, r;

		if (isAllDataLoaded) {
			//offline search
			data = {count: 0, data: [], error: "ok"};

			if (searchText === "") {
				data.data = [...offlineData];
				data.count = offlineData.length;
			} else {
				r = new RegExp("^" + searchText, "i");
				data.data = offlineData.filter(function (o) {
    				if (o.KOD.search(r) !== -1) {
        				return true;
    				} else if (o.NAZ.search(r) !== -1) {
        				return true;
    				}
					return false;
				});
				data.count = data.data.length;
			}
			lastSearchedText = searchText;
		} else {
			//online search
			uri = "/api/diag?limit=" + dataChunk + "&offset=" + dataOffset;
			if (searchText !== "") {
				uri += "&searchedText=" + encodeURI(searchText);
				lastSearchedText = searchText;
			} else {
				lastSearchedText = "";
			}
			res = await fetch(uri);
			data = await res.json();
		}
    	return { body: data };
	}
	
	async function infiniteHandler({ detail: { loaded, complete } }) {
		let responseData;

		if (!loadingNextData) {
			loadingNextData = true;

			try {
				responseData = await fetchData();
				
				if (responseData.body.error === "ok") {
					dataMaxCount = responseData.body.count;
					data = [...data, ...responseData.body.data];
					loadingNextData = false;

					if (dataMaxCount === data.length) {						
						if (!isAllDataLoaded) {
							dataLoadedCount = dataMaxCount;
						}
						dataCount = dataMaxCount;						
						if (searchText === "") {
							isAllDataLoaded = true;
						}
						complete();
					} else {
						dataCount += dataChunk;
						dataLoadedCount += dataChunk;
						dataOffset += dataChunk;
						loaded();
					}								
				} else {
					console.error("Communication error:", responseData.body.error);
					dataOffset = 0;
					dataMaxCount = null;
					dataCount = 0;
					data = [];
					loadingNextData = true;
					dataLoadedCount = 0;
					isAllDataLoaded = false;
				}
			} catch(e) {
				console.error("Parsing data error", e);
				loadingNextData = true;	//schvalne to neukonci a zblokuj dalsi nacitani
			}
		}
	}

	function onItemsUpdated(event) {
		if (event?.detail) {
    		start = event.detail.start
    		end = event.detail.end
		}
	}

	function selectItem(index, event) {
		if (selectedItem !== null) {
			selectedItem.style.border = "none";
			selectedItem = null;
		}
		
		if (selectedIndex === index) {
			//unselect this item
			selectedIndex = null;
			dispatch("selectItem", null);
		} else {		
			//select this item
			selectedIndex = index;
			if (cmp) {
				selectedItem = cmp.querySelector(`[data-num="${index+1}"]`);
				selectedItem.style.border = "2px solid blue";
			}			

			dispatch("selectItem", data[index]);
		}
	}

	function postponeSearchText() {		
		if (!isAllDataLoaded) {
			dataMaxCount = null;
			dataLoadedCount = 0;
		} else {
			if (offlineData === null) {
				offlineData = data;
			}
		}
		dataOffset = 0;
		dataCount = 0;	
		data = [];
		start = 0;
		end = 0;
		loadingNextData = false;
		selectedItem = null;
		selectedIndex = null;

		clearTimeout(postponeSearchTimerId);
		postponeSearchTimerId = null;

		infiniteId = Symbol();
	}

	function onSearchTextChanged() {		
		if (postponeSearchTimerId !== null) {
			clearTimeout(postponeSearchTimerId);
			postponeSearchTimerId = null;
		}
		
		if (lastSearchedText !== searchText) {
			postponeSearchTimerId = setTimeout(
				postponeSearchText.bind(this),
				POSTPONE_SEARCH_IN_MS
			);
		}
	}

	onDestroy(() => {
		if (postponeSearchTimerId !== null) {
			clearTimeout(postponeSearchTimerId);
			postponeSearchTimerId = null;
		}

		data = null;
		offlineData = null;
	});

	
	$: onSearchTextChanged(searchText);
</script>

<div class="w-96 flex flex-col" bind:this={cmp}>
	<input type="text" class="w-full" bind:value={searchText} placeholder={searchPlaceholder} />
  
	<div class="my-2 flex text-sm">
	  Počet výsledků {dataMaxCount} (loaded: {dataLoadedCount})
	  <div class="ml-auto">
		start {start} end {end}
	  </div>
	</div>
  
	<VirtualList		
		width="100%"
		height={200}
		itemCount={dataCount}
		itemSize={30}
		scrollDirection="vertical"		
		on:itemsUpdated={onItemsUpdated}>
			<div slot="item" let:index data-num={index + 1} let:style {style} class="overflow-hidden" on:click={selectItem.bind(undefined, index)}>
				{#if data[index]}
					<span class="inline-block w-16 font-bold text-center">{data[index].KOD}</span>
					<span>{data[index].NAZ}</span>
				{/if}
			</div>

			<div slot="footer">
				<InfiniteLoading on:infinite={infiniteHandler} spinner="circles" direction="bottom" identifier={infiniteId}>
					<div slot="noResults"></div>
					<div slot="noMore"></div>
				</InfiniteLoading>
			</div>
	</VirtualList>
	
</div>
