<script>
	export let name;
	export let parsedText;

	function toggleName() {
		name = (name === 'world') ? "Svelte" : "world"
	}

	function updateState() {
		let val = dom.get("input-area").value;
		dom.get("text-option-div").style.display = (val.length > 0) ? "block": "none";
	}

	function clearText() {
		dom.get("input-area").value = "";
		updateState()
	}

	function parseText() {
		console.log("GIF")
		dom.show("parsed-text-parent-div")
		parsedText = dom.get("input-area").value;
		clearText()
	}


</script>

<main class="p-5">

	<h1>Hello {name}!</h1>
	<button class="btn btn-primary" on:click={toggleName}>Toggle name</button>

	<div class="my-5 bg-light p-3 rounded-3">
		<h4>Paste text here</h4>
		<textarea on:input={updateState} class="form-control" placeholder="Paste text here..." id="input-area" rows="6"></textarea>
		
		<div id="text-option-div" style="display:none;">
			<div class="mt-2 d-flex">
				<button on:click={parseText} class="col btn btn-primary me-2" id="parse-text-btn">Parse text</button>
				<button on:click={clearText} class="col btn btn-danger" id="clear-text-btn">Clear text</button>
			</div>
		</div>
	</div>

	<div class="my-3 bg-light p-3 rounded-3" id="parsed-text-parent-div" style="display:none;">
		<h4>Parsed text</h4>
		<span>{ parsedText }</span>
	</div>

</main>