function generateKeys(numKeys, startingNote) {
	var keys = [];
	keys.push(startingNote);
	var previousNote = startingNote;
	for (i = 1; i < numKeys; i++) {
		var nextNote = {
			octave: getNextOctave(previousNote),
			note: getNextNote(previousNote),
			sharp: getNextSharp(previousNote)
		};
		keys.push(nextNote);
		previousNote = nextNote;
	};
	
	return keys;
}

function getNextOctave(note) {
	if (note.note == "b") {
		return note.octave + 1;
	} else {
		return note.octave;
	};
}

function getNextSharp(note) {
	if (note.note == "b" || note.note == "e") {
		return false;
	} else {
		return !note.sharp;
	}
}

var noteSequence = ["a", "b", "c", "d", "e", "f", "g"];
function getNextNote(note) {
	if (note.note == "b") {
		return "c";
	} else if (note.note == "e") {
		return "f";
	} else if (!note.sharp) {
		return note.note;
	} else if (note.note == "g") {
		return "a";
	} else {
		var index = noteSequence.indexOf(note.note);
		return noteSequence[index+1];
	}
}

function createHtml() {
	createPianoHtml();
	createClefs();
}

function createPianoHtml() {
	var allKeys = generateKeys(88, {octave:0, note: "a", sharp: false});
	var container = document.getElementsByClassName('keyboard-container')
	for (var index in allKeys) {
		var key = allKeys[index];
		const newElement = document.createElement('div');
		newElement.onclick = function() {
			makeGuess(newElement);
		};
		newElement.data = key;
		if (key.sharp) {
			newElement.className = "blackKey";
			newElement.id = key.note + key.octave + "#";
		} else {
			newElement.className = "whiteKey";
			newElement.id = key.note + key.octave;
		}
		container[0].appendChild(newElement);
	};
}

function createClefs() {
	VF = Vex.Flow;
	// We created an object to store the information about the workspace
	var WorkspaceInformation = {
		// The div in which you're going to work
		div: document.getElementById("treble-clef"),
		// Vex creates a svg with specific dimensions
		canvasWidth: 500,
		canvasHeight: 500
	};
	// Create a renderer with SVG
	var renderer = new VF.Renderer(
		WorkspaceInformation.div,
		VF.Renderer.Backends.SVG
	);
	// Use the renderer to give the dimensions to the SVG
	renderer.resize(WorkspaceInformation.canvasWidth, WorkspaceInformation.canvasHeight);

	// Expose the context of the renderer
	var context = renderer.getContext();

	// And give some style to our SVG
	context.setFont("Arial", 10, "").setBackgroundFillStyle("#eed");


	/**
	 * Creating a new stave
	 */
	// Create a stave of width 400 at position x10, y40 on the SVG.
	var stave = new VF.Stave(10, 40, 400);
	// Add a clef and time signature.
	stave.addClef("treble").addTimeSignature("4/4");
	// Set the context of the stave our previous exposed context and execute the method draw !
	stave.setContext(context).draw();
	
	var notes = [
		// A quarter-note C.
		new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),

		// A quarter-note D.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),

		// A quarter-note rest. Note that the key (b/4) specifies the vertical
		// position of the rest.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),

		// A C-Major chord.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" })
	];

	// Create a voice in 4/4 and add above notes
	var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
	voice.addTickables(notes);

	// Format and justify the notes to 400 pixels.
	var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

	// Render voice
	voice.draw(context, stave);
}

var expected = "c4#"
function makeGuess(key) {
	var newNotes = ["c4", "c4#", "d4", "d4#", "e4", "f4", "f#4", "g4", "g4#", "a4", "a4#", "b4"];
	do {
		const newIndex = Math.floor((Math.random() * newNotes.length) + 0);
		var newNote = newNotes[newIndex];
	} while (newNote == expected);
	if (key.id == expected) {
		alert("correct");
	} else {
		alert("incorrect, expected "+expected+" but you played "+key.id);
	}
	expected = newNote;
	notes = [
		// A quarter-note C.
		new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),

		// A quarter-note D.
		new VF.StaveNote({clef: "treble", keys: ["c/4"], duration: "q" }),

		// A quarter-note rest. Note that the key (b/4) specifies the vertical
		// position of the rest.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" }),

		// A C-Major chord.
		new VF.StaveNote({clef: "treble", keys: ["b/4"], duration: "qr" })
	];
	// Create a voice in 4/4 and add above notes
	var voice = new VF.Voice({num_beats: 4,  beat_value: 4});
	voice.addTickables(notes);

	// Format and justify the notes to 400 pixels.
	var formatter = new VF.Formatter().joinVoices([voice]).format([voice], 400);

	// Render voice
	voice.draw(context, stave);
}

window.onload = createHtml;
